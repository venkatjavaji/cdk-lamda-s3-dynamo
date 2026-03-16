#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = __importStar(require("aws-cdk-lib"));
const account_a_1 = require("../lib/account-a");
const account_b_1 = require("../lib/account-b");
const app = new cdk.App();
new account_a_1.AccountAStack(app, 'AccountAStack', {
    env: { account: '158203518916', region: 'us-east-1' }
});
new account_b_1.AccountBStack(app, 'AccountBStack', {
    env: { account: '339712835622', region: 'us-east-1' }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLGlEQUFtQztBQUNuQyxnREFBaUQ7QUFDakQsZ0RBQWlEO0FBRWpELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLElBQUkseUJBQWEsQ0FBQyxHQUFHLEVBQUUsZUFBZSxFQUFFO0lBQ3RDLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRTtDQUN0RCxDQUFDLENBQUM7QUFFSCxJQUFJLHlCQUFhLENBQUMsR0FBRyxFQUFFLGVBQWUsRUFBRTtJQUN0QyxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUU7Q0FDdEQsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IEFjY291bnRBU3RhY2sgfSBmcm9tICcuLi9saWIvYWNjb3VudC1hJztcbmltcG9ydCB7IEFjY291bnRCU3RhY2sgfSBmcm9tICcuLi9saWIvYWNjb3VudC1iJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxubmV3IEFjY291bnRBU3RhY2soYXBwLCAnQWNjb3VudEFTdGFjaycsIHtcbiAgZW52OiB7IGFjY291bnQ6ICcxNTgyMDM1MTg5MTYnLCByZWdpb246ICd1cy1lYXN0LTEnIH1cbn0pO1xuXG5uZXcgQWNjb3VudEJTdGFjayhhcHAsICdBY2NvdW50QlN0YWNrJywge1xuICBlbnY6IHsgYWNjb3VudDogJzMzOTcxMjgzNTYyMicsIHJlZ2lvbjogJ3VzLWVhc3QtMScgfVxufSk7Il19