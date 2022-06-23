import axios, { AxiosResponse } from "axios";
import { QinBody } from "qinpel-res";
import { QinChief } from "./qin-chief";

export class QinTalker {
  private readonly _chief: QinChief;
  private readonly _cmd: QinTalkerCmd;
  private readonly _issued: QinTalkerIssued;

  public constructor(chief: QinChief) {
    this._chief = chief;
    this._cmd = new QinTalkerCmd(this);
    this._issued = new QinTalkerIssued(this);
  }

  public get(address: string, headers?: any): Promise<AxiosResponse<never>> {
    let configs = this._chief.getAxiosConfig(headers);
    return axios.get(address, configs);
  }

  public post(address: string, data: any, headers?: any): Promise<AxiosResponse<any>> {
    let configs = this._chief.getAxiosConfig(headers);
    if (!configs.headers["Content-Type"]) {
      if (typeof data === "string" || data instanceof String) {
        configs.headers["Content-Type"] = "text/plain";
      } else if (data instanceof FormData) {
        configs.headers["Content-Type"] = "multipart/form-data";
      } else {
        configs.headers["Content-Type"] = "application/json";
      }
    }
    return axios.post(address, data, configs);
  }

  public get cmd() {
    return this._cmd;
  }

  public get issued() {
    return this._issued;
  }
}

export class QinTalkerCmd {
  private readonly _talker: QinTalker;

  public constructor(talker: QinTalker) {
    this._talker = talker;
  }

  public list(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      this._talker
        .get("/list/cmds")
        .then((res) => resolve(QinBody.getTextLines(res.data)))
        .catch((err) => reject(err));
    });
  }

  public run(start: CmdRunStart): Promise<IssuedToken> {
    return new Promise<string>((resolve, reject) => {
      this._talker
        .post("/cmd/run", start)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }
}

export type IssuedToken = string;

export class QinTalkerIssued {
  private readonly _talker: QinTalker;

  public constructor(talker: QinTalker) {
    this._talker = talker;
  }

  public ask(question: IssuedQuestion): Promise<IssuedAnswer> {
    return new Promise<IssuedAnswer>((resolve, reject) => {
      this._talker
        .post("/issued", question)
        .then((res) => {
          const lines = QinBody.getTextLines(res.data);
          let answer: IssuedAnswer = {};
          let i = 0;
          let gettingResultLines = false;
          while (i < lines.length) {
            if (!gettingResultLines) {
              switch (lines[i].trim()) {
                case "Created At:":
                  i++;
                  answer.createdAt = +lines[i].trim();
                  break;
                case "Result Coded:":
                  i++;
                  answer.resultCoded = +lines[i].trim();
                  break;
                case "Is Done:":
                  i++;
                  answer.isDone = lines[i].trim() === "true";
                  break;
                case "Finished At:":
                  i++;
                  answer.finishedAt = +lines[i].trim();
                  break;
                case "Result Lines:":
                  answer.resultLines = [];
                  gettingResultLines = true;
                  break;
                default:
                  break;
              }
            } else {
              answer.resultLines.push(lines[i]);
            }
            i++;
          }
          resolve(answer);
        })
        .catch((err) => reject(err));
    });
  }

  public askWhenDone(question: IssuedQuestion): Promise<IssuedAnswer> {
    return new Promise<IssuedAnswer>((resolve, reject) => {
      const questionIsDone = {
        token: question.token,
        askIsDone: true,
      } as IssuedQuestion;
      const askIsDone = () => {
        this.ask(questionIsDone)
          .then((res) => {
            if (res.isDone) {
              this.ask(question)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
            } else {
              setTimeout((_) => askIsDone(), 700);
            }
          })
          .catch((err) => reject(err));
      };
      askIsDone();
    });
  }
}

export type CmdRunStart = {
  exec: string;
  args?: string[];
  input?: string[];
};

export type IssuedQuestion = {
  token: string;
  askCreatedAt?: boolean;
  askResultLines?: boolean;
  askResultLinesFrom?: number;
  askResultCoded?: boolean;
  askIsDone?: boolean;
  askFinishedAt?: boolean;
};

export type IssuedAnswer = {
  createdAt?: number;
  resultLines?: string[];
  resultCoded?: number;
  isDone?: boolean;
  finishedAt?: number;
};
