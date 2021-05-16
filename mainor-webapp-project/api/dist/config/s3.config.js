"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const s3_env_1 = __importDefault(require("./s3.env"));
const s3Client = new aws_sdk_1.default.S3({
    accessKeyId: s3_env_1.default.AWS_ACCESS_KEY,
    secretAccessKey: s3_env_1.default.AWS_SECRET_ACCESS_KEY,
    region: s3_env_1.default.REGION,
});
const uploadParams = {
    Bucket: s3_env_1.default.Bucket + '/uploads',
    Key: '',
    Body: null,
};
const s3 = {}; //Refactor any
s3.s3Client = s3Client;
s3.uploadParams = uploadParams;
exports.default = s3;
