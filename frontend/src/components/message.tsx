import { ERASE_INFOS } from "../redux/actions/types";
import store from "../redux/store";

const messageDisplayTime = 4;

const { message } = require("antd");

function clearInfos() {
  store.dispatch({ type: ERASE_INFOS });
}

export const renderErrorMessage = (error:string) => {
  message.error(error, messageDisplayTime);
  clearInfos();
};

export const renderSuccessMessage = (msg:string) => {
  message.success(msg, messageDisplayTime);
  clearInfos();
};
