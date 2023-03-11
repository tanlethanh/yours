interface IUser {
    id: string;
    email: string;
    username: string;
    password: string;
}

interface IPage {
    id: string;
    page_id: string;
    create_time: Date;
    last_edited_time: Date;
    title: string;
    url: string;
    number_of_usages: number;
}

interface ISentece {
    id: string;
    page_mapping_id: string;
    plain_text: string;
    last_edited_time: Date;
    number_of_usages: number;
    number_of_wrongs: number;
}

enum QuestionType {
    DUPLEX = "DUPLEX",
    FILL = "FILL",
}

interface IQuestionCore {
    id: string;
    sentence_id: string;
    dificulty: number;
    number_of_usages: number;
    number_of_wrong: number;
    last_edited_time: number;
    create_time: Date;
    type: QuestionType;
}

enum Language {
    ENGLISH = "ENGLISH",
    VIETNAMESE = "VIETNAMESE",
}

interface IWords {
    text: string;
    language: Language;
}

interface IDuplexQuestion extends IQuestionCore {
    first: IWords;
    second: IWords;
    type: QuestionType.DUPLEX;
}

interface IFillWordQuestion extends IQuestionCore {
    list_words: [IWords];
    fill_field_indexes: [number];
    language: Language;
    type: QuestionType.FILL;
}

interface IPracticeTest {}

interface IPracticeQuestion {}

interface IMultichoiceQuestion extends IPracticeQuestion {}

interface IFillWordQuestion extends IPracticeQuestion {}

interface ITranslateQuestion extends IPracticeQuestion {}
