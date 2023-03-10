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
    number_of_usages: number;
    number_of_wrongs: number;
    plain_text: string;
    last_edited_time: Date;
}

enum QuestionType {
}

interface IQuestionCore {
    id: string;
    sentence_id: string;
    question: string;
    solution: string;
}

interface IMultichoiceQuestionCore {
    first: string;
    second: string;
}

interface IFillWordQuestionCore {}

interface ITranslateQuestionCore {}

interface IPracticeTest {}

interface IPracticeQuestion {}

interface IMultichoiceQuestion extends IPracticeQuestion {}

interface IFillWordQuestion extends IPracticeQuestion {}

interface ITranslateQuestion extends IPracticeQuestion {}
