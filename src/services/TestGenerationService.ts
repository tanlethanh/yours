import {
    Difficulty,
    IDuplexQuestionCore,
    IFillWordQuestionCore,
    IMultichoiceQuestion,
    IPracticeQuestion,
    ISentence,
    IUser,
    QuestionType,
} from "../interfaces/IData.js";
import { Page } from "../models/NotionImageModels.js";
import {
    FillWordQuestion,
    MultichoiceQuestion,
    PracticeTest,
    TranslateQuestion,
} from "../models/TestModels.js";
import { TestGenerationStrategies } from "../interfaces/IData.js";
import { User } from "../models/UserModel.js";
import { QuestionCore } from "../models/QuestionCoreModels.js";
import { formatStringText, isEqualPureString } from "../utils/stringUtils.js";
import { shuffleArray } from "../utils/arrayUtils.js";

export enum PickedType {
    DEFAULT = "DEFAULT",
    RANDOM = "RANDOM",
}

class TestGenerationService {
    async generateTest(
        user: IUser,
        strategy: TestGenerationStrategies = TestGenerationStrategies.DEFAULT,
        numberOfQuestion = 10
    ) {
        const sentences = await this.filterSentences(user, strategy);
        // console.log(sentences);

        const questions =
            (await this.generateQuestions(
                sentences as Array<ISentence>,
                strategy
            )) || [];

        const test = new PracticeTest({
            strategy: strategy,
            questions: this.arrangeQuestions(questions),
        });

        await test.save();

        return test;
    }

    private async filterSentences(
        user: IUser,
        strategy: TestGenerationStrategies = TestGenerationStrategies.DEFAULT,
        numberOfQuestion = 8
    ) {
        const curUser = await User.findById(user._id);

        if (!curUser) {
            throw Error(
                "Something wrong, can not find this user in db by user object"
            );
        }

        const pages = await Page.find(
            {
                _id: {
                    $in: curUser.pages,
                },
            },
            {
                sentences: 1,
            }
        ).populate("sentences", "_id last_edited_time number_of_usages");

        // Merge all page
        const allSentences = pages.reduce((prev: Array<any>, page: any) => {
            prev.push(...page.sentences);
            return prev;
        }, []);

        if (allSentences.length < numberOfQuestion) {
            throw Error(
                `Don't have enough resources, require greater than ${numberOfQuestion} sentences`
            );
        }

        if (strategy === TestGenerationStrategies.DEFAULT) {
            const numberNew = numberOfQuestion * 0.8;
            const numberOld = numberOfQuestion - numberNew;

            // Sort by usage and time
            allSentences.sort((a: ISentence, b: ISentence) => {
                if (a.number_of_usages == b.number_of_usages) {
                    if (a.last_edited_time < b.last_edited_time) {
                        return 1;
                    } else {
                        return 0;
                    }
                } else if (a.number_of_usages < b.number_of_usages) {
                    return -1;
                } else {
                    return 1;
                }
            });

            // Add labels
            const results = allSentences.slice(0, numberNew).map((ele) => {
                ele.pickedType = PickedType.DEFAULT;
                return ele;
            });

            // Shuffle other sentences and add labels
            const others = shuffleArray(allSentences.slice(numberNew)).map(
                (ele) => {
                    ele.pickedType = PickedType.RANDOM;
                    return ele;
                }
            );

            results.push(...others.slice(0, numberOld));

            return results;
        }

        return null;
    }

    private async generateQuestions(
        sentences: Array<ISentence>,
        strategy: TestGenerationStrategies = TestGenerationStrategies.DEFAULT
    ) {
        if (strategy == TestGenerationStrategies.DEFAULT) {
            return await this.generateQuestionsWithDefaultStrategy(sentences);
        }

        return null;
    }

    private async generateQuestionsWithDefaultStrategy(
        sentences: Array<ISentence>
    ) {
        const questions: IPracticeQuestion[] = [];
        const multichoieDicts = (
            await QuestionCore.find(
                {
                    type: QuestionType.CORE_DUPLEX,
                },
                {
                    first: {
                        text: 1,
                    },
                }
            )
        )
            .filter((ele: any) => {
                return ele.first.text.split(" ").length <= 3;
            })
            .map((ele: any) => {
                return formatStringText(ele.first.text);
            });

        for (let i = 0; i < sentences.length; i++) {
            const questionCores = await QuestionCore.find({
                sentence: sentences[i]._id,
            });

            console.log(questionCores);

            questionCores.forEach((core) => {
                if (core.type == QuestionType.CORE_DUPLEX) {
                    const currentCore = core as IDuplexQuestionCore;

                    let qtDf = Difficulty.MEDIUM;

                    const numWords = currentCore.first.text.split(" ").length;

                    if (numWords > 3) {
                        qtDf = Difficulty.HARD;
                    }

                    // Generate translate question
                    const translateQt = new TranslateQuestion({
                        question_text: formatStringText(
                            currentCore.second.text
                        ),
                        solution: formatStringText(currentCore.first.text),
                        difficulty: qtDf,
                    });
                    questions.push(translateQt);

                    // Generate multichoice question in case number of words in text <= 3
                    if (numWords <= 3) {
                        const solution = formatStringText(
                            currentCore.first.text
                        );

                        let answers;
                        try {
                            answers = shuffleArray(
                                multichoieDicts.filter(
                                    (ele) => !isEqualPureString(ele, solution)
                                )
                            ).slice(0, 3);

                            answers.push(solution);
                            answers = shuffleArray(answers);

                            const multQt = new MultichoiceQuestion({
                                question_text: formatStringText(
                                    currentCore.second.text
                                ),
                                answers: answers,
                                solution_index: answers.indexOf(solution),
                                difficulty: Difficulty.EASY,
                            });

                            questions.push(multQt);
                        } catch (error) {}
                    }
                } else if (core.type == QuestionType.CORE_FILL) {
                    // Create fill word questions for any fill fields
                    const len = (core as IFillWordQuestionCore)
                        .fill_field_indexes.length;

                    for (let i = 0; i < len; i++) {
                        const qt = new FillWordQuestion({
                            list_words: (core as IFillWordQuestionCore)
                                .list_words,
                            solution_index: (core as IFillWordQuestionCore)
                                .fill_field_indexes[i],
                            difficulty: Difficulty.MEDIUM,
                        });
                        questions.push(qt);
                    }
                }
            });
        }

        console.log(questions.length);

        return questions;
    }

    private arrangeQuestions(questions: Array<IPracticeQuestion>) {
        const part1 = questions.filter(
            (ele) => ele.difficulty == Difficulty.EASY
        );
        const part2 = questions.filter(
            (ele) => ele.difficulty == Difficulty.MEDIUM
        );
        const part3 = questions.filter(
            (ele) => ele.difficulty == Difficulty.HARD
        );

        const results = [];
        results.push(...shuffleArray(part1));
        results.push(...shuffleArray(part2));
        results.push(...shuffleArray(part3));

        return results;
    }
}

export default new TestGenerationService();
