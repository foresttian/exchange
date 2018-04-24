const chai = require('chai');
const expect = require('chai').expect;
const nock = require('nock');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
const exc = require('../index').exchangeCurrency;
chai.use(sinonChai);

describe('Test cases', () => {
	before(() => {			
	});
	beforeEach(() => {		
		sinon.spy(console,'error');			
	});
	afterEach(() => {
		console.error.restore();
	});
	it('Green test case 1. 06-03 is Sat, should return 06-02', async () => {
		const response = await exc('2017-06-03', 'USD', 100, 'CAD');
		expect(typeof response).to.equal('object');			
		expect(response.date).to.equal('2017-06-02');	
		expect(response.base_currency).to.equal('USD');		
		expect(response.base_amount).to.equal(100);		
		expect(response.conversion_currency).to.equal('CAD');		
		expect(response.conversion_amount).to.equal(135.23);
	});
	
	it('Green test case 2', async () => {
		const response = await exc('2007-07-12', 'GBP', 303, 'SEK');
		expect(typeof response).to.equal('object');			
		expect(response.date).to.equal('2007-07-12');	
		expect(response.base_currency).to.equal('GBP');		
		expect(response.base_amount).to.equal(303);		
		expect(response.conversion_currency).to.equal('SEK');		
		expect(response.conversion_amount).to.equal(4085.0157);
	});

	it('Green test case 3, 08-07 is Sat, should rturn 08-06', async () => {
		const response = await exc('2004-08-07', 'EUR', 5, 'PLN');
		expect(typeof response).to.equal('object');			
		expect(response.date).to.equal('2004-08-06');	
		expect(response.base_currency).to.equal('EUR');		
		expect(response.base_amount).to.equal(5);		
		expect(response.conversion_currency).to.equal('PLN');		
		expect(response.conversion_amount).to.equal(22.01);
	});
	
	it('Green test case 4', async () => {
		const response = await exc('2017-02-09', 'ZAR', 132, 'TRY');
		expect(typeof response).to.equal('object');			
		expect(response.date).to.equal('2017-02-09');	
		expect(response.base_currency).to.equal('ZAR');		
		expect(response.base_amount).to.equal(132);		
		expect(response.conversion_currency).to.equal('TRY');		
		expect(response.conversion_amount).to.equal(36.3528);
	});
	
	it('Green test case 5', async () => {
		const response = await exc('2011-06-03', 'USD', 100, 'CAD');
		expect(typeof response).to.equal('object');			
		expect(response.date).to.equal('2011-06-03');	
		expect(response.base_currency).to.equal('USD');		
		expect(response.base_amount).to.equal(100);		
		expect(response.conversion_currency).to.equal('CAD');		
		expect(response.conversion_amount).to.equal(97.85);
	});
	
	it('Edge test case 1, base and conversation currency is same', async () => {
		const response = await exc('2011-06-03', 'USD', 100, 'USD');
		expect(typeof response).to.equal('object');			
		expect(response.date).to.equal('2011-06-03');	
		expect(response.base_currency).to.equal('USD');		
		expect(response.base_amount).to.equal(100);		
		expect(response.conversion_currency).to.equal('USD');		
		expect(response.conversion_amount).to.equal(100);
	});
	
	it('Edge test case 2, amount 0', async () => {
		const response = await exc('2011-06-03', 'USD', 0, 'CAD');
		expect(typeof response).to.equal('object');			
		expect(response.date).to.equal('2011-06-03');	
		expect(response.base_currency).to.equal('USD');		
		expect(response.base_amount).to.equal(0);		
		expect(response.conversion_currency).to.equal('CAD');		
		expect(response.conversion_amount).to.equal(0);
	});
	
	it('Failure test case 1, wrong day format', async () => {
		const response = await exc('NONSENSE', 'USD', 100, 'CAD');
		expect(response).to.equal(null);
		expect(console.error).to.be.calledWith("invalid date string, try YYYY-MM-DD");
	});
	
	it('Failure test case 2, wrong day format', async () => {
		const response = await exc('2007-13-02', 'USD', 100, 'CAD');
		expect(response).to.equal(null);
		expect(console.error).to.be.calledWith("invalid date string, try YYYY-MM-DD");
	});
	
	it('Failure test case 3, wrong day format 2', async () => {
		const response = await exc('19-11-29', 'USD', 100, 'CAD');
		expect(response).to.equal(null);
		expect(console.error).to.be.calledWith("invalid date string, try YYYY-MM-DD");
	});
	
	const UNDEFINED = "UNK";
	it('Failure test case 4, senario no base currency abbr', async () => {
		const response = await exc('2011-06-03', UNDEFINED, 100, 'CAD');
		expect(response).to.equal(null);		
		expect(console.error).to.be.calledWith("Please contact server developer if previous messages cannot solve your problem");
	});
	
	it('Failure test case 5, senario no conversation currency abbr', async () => {
		const response = await exc('2011-06-03', 'USD', 100, UNDEFINED);
		expect(response).to.equal(null);		
		expect(console.error).to.be.calledWith("invalid conversion currency abbr");
	});
	
	const ILLEGAL = "ILLEGAL";
	it('Failure test case 6, wrong abbre of base currency', async () => {
		const response = await exc('2011-06-03', 'USD', 100, ILLEGAL);
		expect(response).to.equal(null);		
		expect(console.error).to.be.calledWith("invlid conversion currency abbr");
	});
	
	it('Failure test case 7, wrong abbre of conversation currency', async () => {
		const response = await exc('2011-06-03', ILLEGAL, 100, 'CAD');
		expect(response).to.equal(null);		
		expect(console.error).to.be.calledWith("invalid base currency abbr");
	});
	
		
	it('Failure test case 8, amount negative', async () => {
		const response = await exc('2011-06-03', 'USD', -100, 'CAD');
		expect(response).to.equal(null);		
		expect(console.error).to.be.calledWith("invalid currency amount, please use number and do not input smaller digits than cent");
	});
});