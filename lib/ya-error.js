import _ from 'lodash';

export default class YaError extends Error {
	constructor(...args) {
		super();
		const { defaultMessage } = this.constructor;
		this.message = _.isString(args[0]) ? args.shift() : defaultMessage;
		this.cause = args[0] instanceof Error ? args.shift() : null;
		this.data = args[0] || null;
	}

	get name() {
		return this.constructor.name;
	}

	static get defaultMessage() {
		return 'An error has occurred';
	}

	static get isYaError() {
		return true;
	}

	static get nameChain() {
		const sup = Object.getPrototypeOf(this) || {};
		const nameChain = sup.nameChain || [];
		nameChain.push(this.name);
		return nameChain;
	}

	static is(sup, err) {
		if (err instanceof sup) return true;
		if (sup.name === 'Error') return true;
		if (!err.constructor.isYaError) return false;
		return err.constructor.nameChain.includes(sup.name);
	}
}
