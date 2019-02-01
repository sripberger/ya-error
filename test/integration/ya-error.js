/* eslint max-classes-per-file: off */

const YaError = require('../../cjs');

describe('YaError', function() {
	it('extends Error with generic default message and optional cause and data arguments', function() {
		// Create some stuff to try out all the possible signatures.
		const message = 'Omg bad error!';
		const cause = new Error('omg cause of bad error!');
		const data = { foo: 'bar' };

		// Default
		let err = new YaError();
		expect(err).to.be.an.instanceof(Error);
		expect(err.message).to.equal('An error has occurred');
		expect(err.cause).to.be.null;
		expect(err.data).to.be.null;

		// Message only
		err = new YaError(message);
		expect(err).to.be.an.instanceof(Error);
		expect(err.message).to.equal(message);
		expect(err.cause).to.be.null;
		expect(err.data).to.be.null;

		// Cause only
		err = new YaError(cause);
		expect(err).to.be.an.instanceof(Error);
		expect(err.message).to.equal('An error has occurred');
		expect(err.cause).to.equal(cause);
		expect(err.data).to.be.null;

		// Data only
		err = new YaError(data);
		expect(err).to.be.an.instanceof(Error);
		expect(err.message).to.equal('An error has occurred');
		expect(err.cause).to.be.null;
		expect(err.data).to.equal(data);

		// Message and cause
		err = new YaError(message, cause);
		expect(err).to.be.an.instanceof(Error);
		expect(err.message).to.equal(message);
		expect(err.cause).to.equal(cause);
		expect(err.data).to.be.null;

		// Message and data
		err = new YaError(message, data);
		expect(err).to.be.an.instanceof(Error);
		expect(err.message).to.equal(message);
		expect(err.cause).to.be.null;
		expect(err.data).to.equal(data);

		// Cause and data
		err = new YaError(cause, data);
		expect(err).to.be.an.instanceof(Error);
		expect(err.message).to.equal('An error has occurred');
		expect(err.cause).to.equal(cause);
		expect(err.data).to.equal(data);

		// Everything
		err = new YaError(message, cause, data);
		expect(err).to.be.an.instanceof(Error);
		expect(err.message).to.equal(message);
		expect(err.cause).to.equal(cause);
		expect(err.data).to.equal(data);
	});

	it('allows overriding of the default message', function() {
		// Create a subclass with an overriden default message.
		const defaultMessage = 'some other default message';
		class FooError extends YaError {
			static get defaultMessage() {
				return defaultMessage;
			}
		}

		// Make sure it works.
		expect(new FooError().message).to.equal(defaultMessage);
	});

	it('names errors based on their constructors', function() {
		// Make some simplie subclasses.
		class FooError extends YaError {}
		class BarError extends FooError {}
		class BazError extends YaError {}

		// Make some instances.
		const yaErr = new YaError();
		const fooErr = new FooError();
		const barErr = new BarError();
		const bazErr = new BazError();

		// Check their names.
		expect(yaErr.name).to.equal('YaError');
		expect(fooErr.name).to.equal('FooError');
		expect(barErr.name).to.equal('BarError');
		expect(bazErr.name).to.equal('BazError');
	});

	it('supports checking against error heirarchies', function() {
		// Make some simple subclasses.
		class FooError extends YaError {}
		class BarError extends YaError {}
		class BazError extends FooError {}

		// Check a plain old Error
		let err = new Error();
		expect(YaError.is(Error, err)).to.be.true;
		expect(YaError.is(YaError, err)).to.be.false;
		expect(YaError.is(FooError, err)).to.be.false;
		expect(YaError.is(BarError, err)).to.be.false;
		expect(YaError.is(BazError, err)).to.be.false;

		// Check a YaError
		err = new YaError();
		expect(YaError.is(Error, err)).to.be.true;
		expect(YaError.is(YaError, err)).to.be.true;
		expect(YaError.is(FooError, err)).to.be.false;
		expect(YaError.is(BarError, err)).to.be.false;
		expect(YaError.is(BazError, err)).to.be.false;

		// Check a FooError
		err = new FooError();
		expect(YaError.is(Error, err)).to.be.true;
		expect(YaError.is(YaError, err)).to.be.true;
		expect(YaError.is(FooError, err)).to.be.true;
		expect(YaError.is(BarError, err)).to.be.false;
		expect(YaError.is(BazError, err)).to.be.false;

		// Check a BarError
		err = new BarError();
		expect(YaError.is(Error, err)).to.be.true;
		expect(YaError.is(YaError, err)).to.be.true;
		expect(YaError.is(FooError, err)).to.be.false;
		expect(YaError.is(BarError, err)).to.be.true;
		expect(YaError.is(BazError, err)).to.be.false;

		// Check a BazError
		err = new BazError();
		expect(YaError.is(Error, err)).to.be.true;
		expect(YaError.is(YaError, err)).to.be.true;
		expect(YaError.is(FooError, err)).to.be.true;
		expect(YaError.is(BarError, err)).to.be.false;
		expect(YaError.is(BazError, err)).to.be.true;
	});

	it('supports heirarchy checking on instanceof false negative', function() {
		// Make some simple subclasses.
		class FooError extends YaError {}
		class BarError extends YaError {}
		class BazError extends FooError {}

		// Create some instances
		const err = new Error();
		const yaErr = new YaError();
		const fooErr = new FooError();
		const barErr = new BarError();
		const bazErr = new BazError();

		// Store a reference to YaError::is for use in the following block.
		const { is } = YaError;

		{
			// Deliberately mask error classes in this block to test
			// fallback when instanceof fails.
			/* eslint-disable no-shadow */
			class Error {}
			class YaError {}
			class FooError {}
			class BarError {}
			class BazError {}
			/* eslint-enable no-shadow */

			// Check a plain old Error
			// TODO: Make this first case work....
			// expect(is(Error, err)).to.be.true;
			expect(is(YaError, err)).to.be.false;
			expect(is(FooError, err)).to.be.false;
			expect(is(BarError, err)).to.be.false;
			expect(is(BazError, err)).to.be.false;

			// Check a YaError
			expect(is(Error, yaErr)).to.be.true;
			expect(is(YaError, yaErr)).to.be.true;
			expect(is(FooError, yaErr)).to.be.false;
			expect(is(BarError, yaErr)).to.be.false;
			expect(is(BazError, yaErr)).to.be.false;

			// Check a FooError
			expect(is(Error, fooErr)).to.be.true;
			expect(is(YaError, fooErr)).to.be.true;
			expect(is(FooError, fooErr)).to.be.true;
			expect(is(BarError, fooErr)).to.be.false;
			expect(is(BazError, fooErr)).to.be.false;

			// Check a BarError
			expect(is(Error, barErr)).to.be.true;
			expect(is(YaError, barErr)).to.be.true;
			expect(is(FooError, barErr)).to.be.false;
			expect(is(BarError, barErr)).to.be.true;
			expect(is(BazError, barErr)).to.be.false;

			// Check a BazError
			expect(is(Error, bazErr)).to.be.true;
			expect(is(YaError, bazErr)).to.be.true;
			expect(is(FooError, bazErr)).to.be.true;
			expect(is(BarError, bazErr)).to.be.false;
			expect(is(BazError, bazErr)).to.be.true;
		}
	});
});
