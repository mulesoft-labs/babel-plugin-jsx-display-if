import {transform} from 'babel-core';
import {expect} from 'chai';
import b from 'js-beautify';

describe('jsx-if', function() {
	it('can use an expression as a conditional', function() {
		const code = '<div display-if={yay} a="b"/>';
		const expected = 'yay ? j("div", { a: "b" }) : null;';
		const compiled = transform(code, {
            plugins: ['../index'],
            blacklist: ["useStrict"],
            jsxPragma: 'j',
		}).code;
		expect(b(compiled)).to.equal(b(expected));
	});
    it('ignores spread attributes', function() {
        const code = '<div {...someAttrs}/>';
        const expected = 'j("div", someAttrs);';
        const compiled = transform(code, {
            plugins: ['../index'],
            blacklist: ["useStrict"],
            jsxPragma: 'j',
        }).code;
        expect(b(compiled)).to.equal(b(expected));
    });
    it('can use a constant as a conditional', function() {
        const code = '<div display-if={true}/>';
        const expected = 'true ? j("div", null) : null;';
        const compiled = transform(code, {
            plugins: ['../index'],
            blacklist: ["useStrict"],
            jsxPragma: 'j',
        }).code;
        expect(b(compiled)).to.equal(b(expected));
    });
    it('can be used on JSX elements with a closing element and children', function() {
        const code = '<div display-if={true}>yay</div>';
        const expected = `
            true ? j(
                "div",
                null,
                "yay"
            ) : null;`;
        const compiled = transform(code, {
            plugins: ['../index'],
            blacklist: ["useStrict"],
            jsxPragma: 'j',
        }).code;
        expect(b(compiled)).to.equal(b(expected));
    });
    it('can be used on JSXElements nested in other JSXElements', function() {
        const code = '<div><div display-if={yay}/></div>';
        const expected = `
            j(
                "div",
                null,
                yay ? j("div", null) : null
            );`
        const compiled = transform(code, {
            plugins: ['../index'],
            blacklist: ["useStrict"],
            jsxPragma: 'j',
        }).code;
        expect(b(compiled)).to.equal(b(expected));
    });
    it('can be used in JSXExpressionBlocks', function() {
        const code = `
            <div>
                { a.map(() =>
                   <div display-if={yay}/>
                )}
            </div>`;
        const expected = `
            j(
                "div",
                null,
                a.map(function() {
                    return yay ? j("div", null) : null;
                })
            );`;
        const compiled = transform(code, {
            plugins: ['../index'],
            blacklist: ["useStrict"],
            jsxPragma: 'j',
        }).code;
        expect(b(compiled)).to.equal(b(expected));
    });
    it('can be nested', function() {
        const code = `
            <span display-if={boo}>
                <div display-if={yay}/>
            </span>`;
        const expected = `
            boo ? j(
                "span",
                null,
                yay ? j("div", null) : null
            ) : null;`;
        const compiled = transform(code, {
            plugins: ['../index'],
            blacklist: ["useStrict"],
            jsxPragma: 'j',
        }).code;
        expect(b(compiled)).to.equal(b(expected));
    });
});
