/* eslint max-classes-per-file: off */

import YaError from '../../lib/ya-error';

// We need a subclass to test behavior when YaError is extended.
class TestError extends YaError {}

describe('YaError', function() {
	describe('constructor', function() {
		const defaultMessage = 'omg default message!';
		const message = 'omg bad error!';
		const cause = new Error('omg cause of bad error!');
		const data = { foo: 'bar' };

		beforeEach(function() {
			sinon.stub(TestError, 'defaultMessage').get(() => defaultMessage);
		});

		it('extends Error', function() {
			expect(new TestError()).to.be.an.instanceof(Error);
		});

		it('supports signature with message, cause, and data', function() {
			const err = new TestError(message, cause, data);

			expect(err.message).to.equal(message);
			expect(err.cause).to.equal(cause);
			expect(err.data).to.equal(data);
		});

		it('supports signature with no data', function() {
			const err = new TestError(message, cause);

			expect(err.message).to.equal(message);
			expect(err.cause).to.equal(cause);
			expect(err.data).to.be.null;
		});

		it('supports signature with no cause', function() {
			const err = new TestError(message, data);

			expect(err.message).to.equal(message);
			expect(err.cause).to.be.null;
			expect(err.data).to.equal(data);
		});

		it('supports signature with no message', function() {
			const err = new TestError(cause, data);

			expect(err.message).to.equal(defaultMessage);
			expect(err.cause).to.equal(cause);
			expect(err.data).to.equal(data);
		});

		it('supports signature with message only', function() {
			const err = new TestError(message);

			expect(err.message).to.equal(message);
			expect(err.cause).to.be.null;
			expect(err.data).to.null;
		});

		it('supports signature with cause only', function() {
			const err = new TestError(cause);

			expect(err.message).to.equal(defaultMessage);
			expect(err.cause).to.equal(cause);
			expect(err.data).to.be.null;
		});

		it('supports signature with data only', function() {
			const err = new TestError(data);

			expect(err.message).to.equal(defaultMessage);
			expect(err.cause).to.be.null;
			expect(err.data).to.equal(data);
		});

		it('supports signature with no arguments', function() {
			const err = new TestError();

			expect(err.message).to.equal(defaultMessage);
			expect(err.cause).to.be.null;
			expect(err.data).to.be.null;
		});
	});

	describe('@name', function() {
		it('returns constructor name', function() {
			expect(new YaError().name).to.equal('YaError');
			expect(new TestError().name).to.equal('TestError');
		});
	});

	describe('@@defaultMessage', function() {
		it('returns \'An error has occurred\'', function() {
			expect(TestError.defaultMessage).to.equal('An error has occurred');
		});
	});

	describe('@@isYaError', function() {
		it('returns true', function() {
			expect(TestError.isYaError).to.be.true;
		});
	});

	describe('@@nameChain', function() {
		it('returns list of inherited names by stepping up through prototypes', function() {
			class FooError extends TestError {}
			class BarError extends TestError {}
			class BazError extends YaError {}

			expect(YaError.nameChain).to.deep.equal([
				'Error',
				'YaError',
			]);
			expect(TestError.nameChain).to.deep.equal([
				'Error',
				'YaError',
				'TestError',
			]);
			expect(FooError.nameChain).to.deep.equal([
				'Error',
				'YaError',
				'TestError',
				'FooError',
			]);
			expect(BarError.nameChain).to.deep.equal([
				'Error',
				'YaError',
				'TestError',
				'BarError',
			]);
			expect(BazError.nameChain).to.deep.equal([
				'Error',
				'YaError',
				'BazError',
			]);
		});
	});

	describe('::is', function() {
		let isYarErrorStub, nameChainStub, err;

		class FooError extends YaError {}
		class BarError extends YaError {}

		beforeEach(function() {
			isYarErrorStub = sinon.stub(BarError, 'isYaError')
				.get(() => true);
			nameChainStub = sinon.stub(BarError, 'nameChain')
				.get(() => [ 'YaError', 'BarError' ]);

			err = new BarError();
		});

		it('returns true if sup name is in err constructor\'s name chain', function() {
			nameChainStub.get(() => [ 'YaError', 'FooError', 'BarError' ]);

			expect(YaError.is(FooError, err)).to.be.true;
		});

		it('returns false if sup name is not in err constructor\'s name chain', function() {
			expect(YaError.is(FooError, err)).to.be.false;
		});

		it('returns false without getting name chain if err is not a YaError', function() {
			isYarErrorStub.get(() => false);
			nameChainStub.get(() => {
				throw new Error('Should not get err contructor name chain');
			});

			expect(YaError.is(FooError, err)).to.be.false;
		});

		it('returns true without checking for YaError if err is instance of sup', function() {
			class BazError extends BarError {}
			err = new BazError();
			isYarErrorStub.get(() => {
				throw new Error('Should not check err constructor isYaError');
			});

			expect(YaError.is(BarError, err)).to.be.true;
		});
	});
});
