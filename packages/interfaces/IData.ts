import { Document, Schema } from "mongoose";

export interface INotionData {
    access_token: string;
    token_type: string;
    bot_id: string;
    workspace_name: string;
    workspace_icon: string;
    workspace_id: string;
    owner: {
        type: string;
        user: {
            object: string;
            id: string;
            name: string;
            avatar_url: string;
            type: string;
            person: {
                email: string;
            };
        };
    };
    duplicated_template_id: string;
}

export enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER",
}

export interface IUser extends Document {
    _id: Schema.Types.ObjectId;
    email: string;
    username: string;
    password: string;
    notion_data: INotionData;
    pages: Array<IPage>;
    firebase_uid: String;
    role: UserRole;
}

export interface IPage extends Document {
    _id: Schema.Types.ObjectId;
    root_id: string;
    created_time: Date;
    last_edited_time: Date;
    title: string;
    url: string;
    number_of_usages: number;
    sentences: Array<ISentence> | Array<Schema.Types.ObjectId>;
    id_deleted: Boolean;
}

export interface ISentence extends Document {
    _id: Schema.Types.ObjectId;
    root_id: string;
    page: Schema.Types.ObjectId | IPage;
    plain_text: string;
    created_time: Date;
    last_edited_time: Date;
    number_of_usages: number;
    number_of_wrongs: number;
    list_question_core: Schema.Types.ObjectId | IQuestionCore;
    is_deleted: Boolean;
}

export enum QuestionType {
    CORE_DUPLEX = "DUPLEX",
    CORE_FILL = "FILL",
}

export enum Difficulty {
    EASY = 0,
    MEDIUM = 10,
    HARD = 20,
}

export interface IQuestionCore extends Document {
    _id: Schema.Types.ObjectId;
    sentence: Schema.Types.ObjectId | ISentence;
    dificulty: Difficulty;
    number_of_usages: number;
    number_of_wrong: number;
    last_edited_time: number;
    created_time: Date;
    type: QuestionType;
}

export enum Language {
    ENGLISH = "ENGLISH",
    VIETNAMESE = "VIETNAMESE",
    UNDEFINED = "UNDEFINED",
}

export interface IWords {
    text: string;
    language: Language;
}

export interface IDuplexQuestionCore extends IQuestionCore {
    first: IWords;
    second: IWords;
    type: QuestionType.CORE_DUPLEX;
}

export interface IFillWordQuestionCore extends IQuestionCore {
    list_words: Array<IWords>;
    fill_field_indexes: Array<Number>;
    hint: string;
    language: Language;
    type: QuestionType.CORE_FILL;
}

export enum PracticeTestStatus {
    INIT = "INIT",
    INPROGRESS = "INPROGRESS",
    DONE = "DONE",
}

export enum TestGenerationStrategies {
    DEFAULT = "DEFAULT",
}

export interface IPracticeTest extends Document {
    _id: Schema.Types.ObjectId;
    questions: Array<Schema.Types.ObjectId | IPracticeQuestion>;
    count_wrongs: Number;
    created_time: Date;
    last_edited_time: Date;
    submited_time: Date | undefined;
    status: PracticeTestStatus;
    strategy: TestGenerationStrategies;
    owner: Schema.Types.ObjectId;
}

export enum PracticeQuestionType {
    MULTICHOICE = "MULTICHOICE",
    FILLWORD = "FILLWORD",
    TRANSLATE = "TRANSLATE",
}

export enum PickedType {
    DEFAULT = "DEFAULT",
    RANDOM = "RANDOM",
    UNDEFINED = "UNDEFINED",
}

export interface IPracticeQuestion extends Document {
    _id: Schema.Types.ObjectId;
    difficulty: Number;
    type: PracticeQuestionType;
    picked_type: PickedType;
    sentence_id: Schema.Types.ObjectId;
}

export interface IMultichoiceQuestion extends IPracticeQuestion {
    question_text: String;
    answers: Array<String> | undefined;
    solution_index: Number;
    user_answer: Number;
}

export interface ITranslateQuestion extends IPracticeQuestion {
    question_text: String;
    solution: String;
    user_answer: String;
}

export interface IFillWordQuestion extends IPracticeQuestion {
    list_words: Array<String>;
    solution_index: Number;
    user_answer: String;
    hint: string;
}
