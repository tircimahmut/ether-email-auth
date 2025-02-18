const utils = require("../../utils");
const ff = require('ffjavascript');
const stringifyBigInts = ff.utils.stringifyBigInts;
const circom_tester = require("circom_tester");
const wasm_tester = circom_tester.wasm;
import * as path from "path";
const p = "21888242871839275222246405745257275088548364400416034343698204186575808495617";
const field = new ff.F1Field(p);
const relayerUtils = require("../../utils");

import { genEmailAuthInput } from "../helpers/email_auth";
import { readFileSync } from "fs";

jest.setTimeout(1440000);
describe("Email Auth", () => {
    let circuit;
    beforeAll(async () => {
        const option = {
            include: path.join(__dirname, "../../../node_modules")
        };
        circuit = await wasm_tester(path.join(__dirname, "../src/email_auth.circom"), option);
    });

    it("Verify a sent email whose subject has an email address", async () => {
        const emailFilePath = path.join(__dirname, "./emails/email_auth_test1.eml");
        const emailRaw = readFileSync(emailFilePath, "utf8");
        const parsedEmail = await relayerUtils.parseEmail(emailRaw);
        console.log(parsedEmail.canonicalizedHeader);
        const accountCode = await relayerUtils.genAccountCode();
        const circuitInputs = await genEmailAuthInput(emailFilePath, accountCode);
        console.log(circuitInputs);
        const witness = await circuit.calculateWitness(circuitInputs);
        await circuit.checkConstraints(witness);
        const domainName = "gmail.com";
        const paddedDomain = relayerUtils.padString(domainName, 255);
        const domainFields = relayerUtils.bytes2Fields(paddedDomain);
        for (let idx = 0; idx < domainFields.length; ++idx) {
            expect(BigInt(domainFields[idx])).toEqual(witness[1 + idx]);
        }
        const expectedPubKeyHash = relayerUtils.publicKeyHash(parsedEmail.publicKey);
        expect(BigInt(expectedPubKeyHash)).toEqual(witness[1 + domainFields.length]);
        const expectedEmailNullifier = relayerUtils.emailNullifier(parsedEmail.signature);
        expect(BigInt(expectedEmailNullifier)).toEqual(witness[1 + domainFields.length + 1]);
        const timestamp = 1694989812n;
        expect(timestamp).toEqual(witness[1 + domainFields.length + 2]);
        const maskedSubject = "Send 0.1 ETH to ";
        const paddedMaskedSubject = relayerUtils.padString(maskedSubject, 605);
        const maskedSubjectFields = relayerUtils.bytes2Fields(paddedMaskedSubject);
        for (let idx = 0; idx < maskedSubjectFields.length; ++idx) {
            expect(BigInt(maskedSubjectFields[idx])).toEqual(witness[1 + domainFields.length + 3 + idx]);
        }
        const fromAddr = "suegamisora@gmail.com";
        const accountSalt = relayerUtils.accountSalt(fromAddr, accountCode);
        expect(BigInt(accountSalt)).toEqual(witness[1 + domainFields.length + 3 + maskedSubjectFields.length]);
        expect(0n).toEqual(witness[1 + domainFields.length + 3 + maskedSubjectFields.length + 1]);
    });

    it("Verify a sent email whose subject does not have an email address", async () => {
        const emailFilePath = path.join(__dirname, "./emails/email_auth_test2.eml");
        const emailRaw = readFileSync(emailFilePath, "utf8");
        const parsedEmail = await relayerUtils.parseEmail(emailRaw);
        console.log(parsedEmail.canonicalizedHeader);
        const accountCode = await relayerUtils.genAccountCode();
        const circuitInputs = await genEmailAuthInput(emailFilePath, accountCode);
        const witness = await circuit.calculateWitness(circuitInputs);
        await circuit.checkConstraints(witness);
        const domainName = "gmail.com";
        const paddedDomain = relayerUtils.padString(domainName, 255);
        const domainFields = relayerUtils.bytes2Fields(paddedDomain);
        for (let idx = 0; idx < domainFields.length; ++idx) {
            expect(BigInt(domainFields[idx])).toEqual(witness[1 + idx]);
        }
        const expectedPubKeyHash = relayerUtils.publicKeyHash(parsedEmail.publicKey);
        expect(BigInt(expectedPubKeyHash)).toEqual(witness[1 + domainFields.length]);
        const expectedEmailNullifier = relayerUtils.emailNullifier(parsedEmail.signature);
        expect(BigInt(expectedEmailNullifier)).toEqual(witness[1 + domainFields.length + 1]);
        const timestamp = 1696964295n;
        expect(timestamp).toEqual(witness[1 + domainFields.length + 2]);
        const maskedSubject = "Swap 1 ETH to DAI";
        const paddedMaskedSubject = relayerUtils.padString(maskedSubject, 605);
        const maskedSubjectFields = relayerUtils.bytes2Fields(paddedMaskedSubject);
        for (let idx = 0; idx < maskedSubjectFields.length; ++idx) {
            expect(BigInt(maskedSubjectFields[idx])).toEqual(witness[1 + domainFields.length + 3 + idx]);
        }
        const fromAddr = "suegamisora@gmail.com";
        const accountSalt = relayerUtils.accountSalt(fromAddr, accountCode);
        expect(BigInt(accountSalt)).toEqual(witness[1 + domainFields.length + 3 + maskedSubjectFields.length]);
        expect(0n).toEqual(witness[1 + domainFields.length + 3 + maskedSubjectFields.length + 1]);
    });

    it("Verify a sent email whose from field has a dummy email address name", async () => {
        const emailFilePath = path.join(__dirname, "./emails/email_auth_test3.eml");
        const emailRaw = readFileSync(emailFilePath, "utf8");
        const parsedEmail = await relayerUtils.parseEmail(emailRaw);
        console.log(parsedEmail.canonicalizedHeader);
        const accountCode = await relayerUtils.genAccountCode();
        const circuitInputs = await genEmailAuthInput(emailFilePath, accountCode);
        const witness = await circuit.calculateWitness(circuitInputs);
        await circuit.checkConstraints(witness);
        const domainName = "gmail.com";
        const paddedDomain = relayerUtils.padString(domainName, 255);
        const domainFields = relayerUtils.bytes2Fields(paddedDomain);
        for (let idx = 0; idx < domainFields.length; ++idx) {
            expect(BigInt(domainFields[idx])).toEqual(witness[1 + idx]);
        }
        const expectedPubKeyHash = relayerUtils.publicKeyHash(parsedEmail.publicKey);
        expect(BigInt(expectedPubKeyHash)).toEqual(witness[1 + domainFields.length]);
        const expectedEmailNullifier = relayerUtils.emailNullifier(parsedEmail.signature);
        expect(BigInt(expectedEmailNullifier)).toEqual(witness[1 + domainFields.length + 1]);
        const timestamp = 1696965932n;
        expect(timestamp).toEqual(witness[1 + domainFields.length + 2]);
        const maskedSubject = "Send 1 ETH to ";
        const paddedMaskedSubject = relayerUtils.padString(maskedSubject, 605);
        const maskedSubjectFields = relayerUtils.bytes2Fields(paddedMaskedSubject);
        for (let idx = 0; idx < maskedSubjectFields.length; ++idx) {
            expect(BigInt(maskedSubjectFields[idx])).toEqual(witness[1 + domainFields.length + 3 + idx]);
        }
        const fromAddr = "suegamisora@gmail.com";
        const accountSalt = relayerUtils.accountSalt(fromAddr, accountCode);
        expect(BigInt(accountSalt)).toEqual(witness[1 + domainFields.length + 3 + maskedSubjectFields.length]);
        expect(0n).toEqual(witness[1 + domainFields.length + 3 + maskedSubjectFields.length + 1]);
    });

    it("Verify a sent email whose from field has a non-English name", async () => {
        const emailFilePath = path.join(__dirname, "./emails/email_auth_test4.eml");
        const emailRaw = readFileSync(emailFilePath, "utf8");
        const parsedEmail = await relayerUtils.parseEmail(emailRaw);
        console.log(parsedEmail.canonicalizedHeader);
        const accountCode = await relayerUtils.genAccountCode();
        const circuitInputs = await genEmailAuthInput(emailFilePath, accountCode);
        const witness = await circuit.calculateWitness(circuitInputs);
        await circuit.checkConstraints(witness);
        const domainName = "gmail.com";
        const paddedDomain = relayerUtils.padString(domainName, 255);
        const domainFields = relayerUtils.bytes2Fields(paddedDomain);
        for (let idx = 0; idx < domainFields.length; ++idx) {
            expect(BigInt(domainFields[idx])).toEqual(witness[1 + idx]);
        }
        const expectedPubKeyHash = relayerUtils.publicKeyHash(parsedEmail.publicKey);
        expect(BigInt(expectedPubKeyHash)).toEqual(witness[1 + domainFields.length]);
        const expectedEmailNullifier = relayerUtils.emailNullifier(parsedEmail.signature);
        expect(BigInt(expectedEmailNullifier)).toEqual(witness[1 + domainFields.length + 1]);
        const timestamp = 1696967028n;
        expect(timestamp).toEqual(witness[1 + domainFields.length + 2]);
        const maskedSubject = "Send 1 ETH to ";
        const paddedMaskedSubject = relayerUtils.padString(maskedSubject, 605);
        const maskedSubjectFields = relayerUtils.bytes2Fields(paddedMaskedSubject);
        for (let idx = 0; idx < maskedSubjectFields.length; ++idx) {
            expect(BigInt(maskedSubjectFields[idx])).toEqual(witness[1 + domainFields.length + 3 + idx]);
        }
        const fromAddr = "suegamisora@gmail.com";
        const accountSalt = relayerUtils.accountSalt(fromAddr, accountCode);
        expect(BigInt(accountSalt)).toEqual(witness[1 + domainFields.length + 3 + maskedSubjectFields.length]);
        expect(0n).toEqual(witness[1 + domainFields.length + 3 + maskedSubjectFields.length + 1]);
    });

    it("Verify a sent email whose subject has an email address and an invitation code", async () => {
        const emailFilePath = path.join(__dirname, "./emails/email_auth_test5.eml");
        const emailRaw = readFileSync(emailFilePath, "utf8");
        const parsedEmail = await relayerUtils.parseEmail(emailRaw);
        console.log(parsedEmail.canonicalizedHeader);
        const accountCode = "0x01eb9b204cc24c3baee11accc37d253a9c53e92b1a2cc07763475c135d575b76";
        const circuitInputs = await genEmailAuthInput(emailFilePath, accountCode);
        const witness = await circuit.calculateWitness(circuitInputs);
        await circuit.checkConstraints(witness);
        const domainName = "gmail.com";
        const paddedDomain = relayerUtils.padString(domainName, 255);
        const domainFields = relayerUtils.bytes2Fields(paddedDomain);
        for (let idx = 0; idx < domainFields.length; ++idx) {
            expect(BigInt(domainFields[idx])).toEqual(witness[1 + idx]);
        }
        const expectedPubKeyHash = relayerUtils.publicKeyHash(parsedEmail.publicKey);
        expect(BigInt(expectedPubKeyHash)).toEqual(witness[1 + domainFields.length]);
        const expectedEmailNullifier = relayerUtils.emailNullifier(parsedEmail.signature);
        expect(BigInt(expectedEmailNullifier)).toEqual(witness[1 + domainFields.length + 1]);
        const timestamp = 1707866192n;
        expect(timestamp).toEqual(witness[1 + domainFields.length + 2]);
        const maskedSubject = "Send 0.12 ETH to ";
        const paddedMaskedSubject = relayerUtils.padString(maskedSubject, 605);
        const maskedSubjectFields = relayerUtils.bytes2Fields(paddedMaskedSubject);
        for (let idx = 0; idx < maskedSubjectFields.length; ++idx) {
            expect(BigInt(maskedSubjectFields[idx])).toEqual(witness[1 + domainFields.length + 3 + idx]);
        }
        const fromAddr = "suegamisora@gmail.com";
        const accountSalt = relayerUtils.accountSalt(fromAddr, accountCode);
        expect(BigInt(accountSalt)).toEqual(witness[1 + domainFields.length + 3 + maskedSubjectFields.length]);
        expect(1n).toEqual(witness[1 + domainFields.length + 3 + maskedSubjectFields.length + 1]);
    });

    it("Verify a sent email whose subject has an invitation code", async () => {
        const emailFilePath = path.join(__dirname, "./emails/email_auth_test6.eml");
        const emailRaw = readFileSync(emailFilePath, "utf8");
        const parsedEmail = await relayerUtils.parseEmail(emailRaw);
        const accountCode = "0x01eb9b204cc24c3baee11accc37d253a9c53e92b1a2cc07763475c135d575b76";
        const circuitInputs = await genEmailAuthInput(emailFilePath, accountCode);
        const witness = await circuit.calculateWitness(circuitInputs);
        await circuit.checkConstraints(witness);
        const domainName = "gmail.com";
        const paddedDomain = relayerUtils.padString(domainName, 255);
        const domainFields = relayerUtils.bytes2Fields(paddedDomain);
        for (let idx = 0; idx < domainFields.length; ++idx) {
            expect(BigInt(domainFields[idx])).toEqual(witness[1 + idx]);
        }
        const expectedPubKeyHash = relayerUtils.publicKeyHash(parsedEmail.publicKey);
        expect(BigInt(expectedPubKeyHash)).toEqual(witness[1 + domainFields.length]);
        const expectedEmailNullifier = relayerUtils.emailNullifier(parsedEmail.signature);
        expect(BigInt(expectedEmailNullifier)).toEqual(witness[1 + domainFields.length + 1]);
        const timestamp = 1711992080n;
        expect(timestamp).toEqual(witness[1 + domainFields.length + 2]);
        const maskedSubject = "Re: Accept guardian request for 0x04884491560f38342C56E26BDD0fEAbb68E2d2FC";
        const paddedMaskedSubject = relayerUtils.padString(maskedSubject, 605);
        const maskedSubjectFields = relayerUtils.bytes2Fields(paddedMaskedSubject);
        for (let idx = 0; idx < maskedSubjectFields.length; ++idx) {
            expect(BigInt(maskedSubjectFields[idx])).toEqual(witness[1 + domainFields.length + 3 + idx]);
        }
        const fromAddr = "suegamisora@gmail.com";
        const accountSalt = relayerUtils.accountSalt(fromAddr, accountCode);
        expect(BigInt(accountSalt)).toEqual(witness[1 + domainFields.length + 3 + maskedSubjectFields.length]);
        expect(1n).toEqual(witness[1 + domainFields.length + 3 + maskedSubjectFields.length + 1]);
    });

    it("Verify a sent email whose subject tries to forge the From field", async () => {
        const emailFilePath = path.join(__dirname, "./emails/email_auth_test7.eml");
        const accountCode = "0x01eb9b204cc24c3baee11accc37d253a9c53e92b1a2cc07763475c135d575b76";
        const circuitInputs = await genEmailAuthInput(emailFilePath, accountCode);
        circuitInputs.from_addr_idx = circuitInputs.subject_idx;
        async function failFn() {
            const witness = await circuit.calculateWitness(circuitInputs);
            await circuit.checkConstraints(witness);
        }
        await expect(failFn).rejects.toThrow();
    });
});