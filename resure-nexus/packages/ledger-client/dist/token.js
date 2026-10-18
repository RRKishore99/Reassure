"use strict";
/**
 * Canton / Daml JWT Token Minting for Authenticated Ledger API access
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPartyToken = createPartyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function createPartyToken(party, readParties, config, isAdmin = false) {
    const readAs = Array.from(new Set([party, ...readParties]));
    const payload = {
        'https://daml.com/ledger-api': {
            ledgerId: config.ledgerId,
            applicationId: config.applicationId,
            actAs: [party],
            readAs,
            admin: isAdmin
        },
        exp: Math.floor(Date.now() / 1000) + 3600 * 24 // 24 hours
    };
    return jsonwebtoken_1.default.sign(payload, config.jwtSecret, { algorithm: 'HS256' });
}
//# sourceMappingURL=token.js.map