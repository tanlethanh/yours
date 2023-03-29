import {
    Difficulty,
    IDuplexQuestionCore,
    IFillWordQuestionCore,
    IMultichoiceQuestion,
    IPracticeQuestion,
    ISentence,
    IUser,
    QuestionType,
    PickedType,
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
import { UserError } from "../exception/Error.js";

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

        // console.log(questions);

        const test = new PracticeTest({
            strategy: strategy,
            questions: this.arrangeQuestionsAndGetIds(questions),
            owner: user._id,
        });

        const result = await (
            await test.save()
        ).populate({
            path: "questions",
            options: { strictPopulate: false },
        });

        return result;
    }

    private async filterSentences(
        user: IUser,
        strategy: TestGenerationStrategies = TestGenerationStrategies.DEFAULT,
        numberOfQuestion = 8
    ) {
        const curUser = await User.findById(user._id);

        if (!curUser) {
            throw new UserError(
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
            throw new UserError(
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
        const questions: any[] = [];

        // Create word dictionary to create multichoice question
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

            for (let j = 0; j < questionCores.length; j++) {
                const core = questionCores[j];
                if (core.type == QuestionType.CORE_DUPLEX) {
                    const currentCore = core as IDuplexQuestionCore;

                    let qtDf = Difficulty.MEDIUM;

                    const numWords = currentCore.first.text.split(" ").length;

                    if (numWords > 3) {
                        qtDf = Difficulty.HARD;
                    }

                    // Generate translate question
                    const translateQt = await TranslateQuestion.create({
                        question_text: formatStringText(
                            currentCore.second.text
                        ),
                        solution: formatStringText(currentCore.first.text),
                        difficulty: qtDf,
                        sentence_id: sentences[i]._id,
                        picked_type: (sentences[i] as any).pickedType,
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

                            const indexSol = answers.indexOf(solution);
                            const multQt = await MultichoiceQuestion.create({
                                question_text: formatStringText(
                                    currentCore.second.text
                                ),
                                answers: answers,
                                solution_index: indexSol,
                                difficulty: Difficulty.EASY,
                                sentence_id: sentences[i]._id,
                                picked_type: (sentences[i] as any).pickedType,
                            });

                            questions.push(multQt);
                        } catch (error) {}
                    }
                } else if (core.type == QuestionType.CORE_FILL) {
                    // Create fill word questions for any fill fields
                    const len = (core as IFillWordQuestionCore)
                        .fill_field_indexes.length;

                    for (let k = 0; k < len; k++) {
                        const fillQt = await FillWordQuestion.create({
                            list_words: (core as IFillWordQuestionCore)
                                .list_words,
                            solution_index: (core as IFillWordQuestionCore)
                                .fill_field_indexes[k],
                            difficulty: Difficulty.MEDIUM,
                            hint: (core as IFillWordQuestionCore).hint,
                            sentence_id: sentences[i]._id,
                            picked_type: (sentences[i] as any).pickedType,
                        });
                        questions.push(fillQt);
                    }
                }
            }
        }

        // console.log(questions.length);

        return questions;
    }

    private arrangeQuestionsAndGetIds(questions: Array<IPracticeQuestion>) {
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

        return results.map((ele) => ele._id);
    }
}

export default new TestGenerationService();
