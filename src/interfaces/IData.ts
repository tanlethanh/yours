import { Document } from "mongoose";

export interface IUser extends Document {
    id: string;
    email: string;
    username: string;
    password: string;
}

export interface IPage extends Document {
    id: string;
    page_id: string;
    created_time: Date;
    last_edited_time: Date;
    title: string;
    url: string;
    number_of_usages: number;
}

export interface ISentence extends Document {
    id: string;
    page_mapping_id: string;
    plain_text: string;
    last_edited_time: Date;
    created_time: Date;
    number_of_usages: number;
    number_of_wrongs: number;
}

export enum QuestionType {
    CORE_DUPLEX = "DUPLEX",
    CORE_FILL = "FILL",
}

export interface IQuestionCore extends Document {
    id: string;
    sentence_id: string;
    dificulty: number;
    number_of_usages: number;
    number_of_wrong: number;
    last_edited_time: number;
    created_time: Date;
    type: QuestionType;
}

export enum Language {
    ENGLISH = "ENGLISH",
    VIETNAMESE = "VIETNAMESE",
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
    language: Language;
    type: QuestionType.CORE_FILL;
}

interface IPracticeTest {}

interface IPracticeQuestion {}

interface IMultichoiceQuestion extends IPracticeQuestion {}

interface ITranslateQuestion extends IPracticeQuestion {}
