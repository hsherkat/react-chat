"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
require("./Header.css");
function Header({ text }) {
    return (react_1.default.createElement("div", { className: "Header" },
        react_1.default.createElement("h2", null,
            " ",
            text,
            " ")));
}
exports.default = Header;
