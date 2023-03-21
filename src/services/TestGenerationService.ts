import { ISentence, IUser } from "../interfaces/IData.js";
import { Page } from "../models/NotionImageModels.js";
import { PracticeTest } from "../models/TestModels.js";
import { TestGenerationStrategies } from "../interfaces/IData.js";
import { User } from "../models/UserModel.js";
import { QuestionCore } from "../models/QuestionCoreModels.js";

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

        const test = await this.generateQuestions(
            sentences as Array<ISentence>,
            strategy
        );
        return sentences;
    }

    async filterSentences(
        user: IUser,
        strategy: TestGenerationStrategies = TestGenerationStrategies.DEFAULT,
        numberOfQuestion = 10
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
            const others = allSentences
                .slice(numberNew)
                .sort((a, b) => {
                    return Math.floor(Math.random() * 3) - 1;
                })
                .map((ele) => {
                    ele.pickedType = PickedType.RANDOM;
                    return ele;
                });

            results.push(...others.slice(0, numberOld));

            return results;
        }

        return null;
    }

    async generateQuestions(
        sentences: Array<ISentence>,
        strategy: TestGenerationStrategies = TestGenerationStrategies.DEFAULT
    ) {
        const test = new PracticeTest({
            strategy: strategy,
        });

        const questions = [];

        if (strategy == TestGenerationStrategies.DEFAULT) {
            sentences.forEach(async (sen) => {
                const questionCores = await QuestionCore.find({
                    sentence: sen._id,
                });
                console.log(questionCores);
            });
        }

        return null;
    }
}

export default new TestGenerationService();
