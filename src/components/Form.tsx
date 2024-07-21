"use client";

import React, { useEffect, useState } from "react";

export interface IFormClasses {
	form: string;
	input: string;
	error: string;
	action: string;
}

export interface IFormProps {
	className?: IFormClasses["form"];
	inputs: {
		className?: IFormClasses["input"];
		name: string;
		type: "text" | "email";
		placeholder: string;
	}[];
	error: {
		className?: IFormClasses["error"];
	};
	action: {
		className?: IFormClasses["action"];
		text: string;
		callback: (...args: string[]) => (string | null)[];
	};
}

export const validateInput = {
	email: (input: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(input);
	},
	id: (input: string): boolean => {
		const usernameRegex = /^[a-zA-Z0-9_]+$/;
		return usernameRegex.test(input);
	},
	text: (input: string): boolean => {
		return true;
	},
};

export default function Form({ className, inputs, error, action }: IFormProps) {
	const [formInputsValue, setFormInputsValue] = useState<
		Record<string, string>
	>({});
	const [formInputErrors, setFormInputErrors] = useState<(string | null)[]>(
		[]
	);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const name = event.target.name;
		const value = event.target.value;

		const updatedFormInputsValue = { ...formInputsValue };
		updatedFormInputsValue[name] = value;

		setFormInputsValue(updatedFormInputsValue);
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const inputErrors: (string | null)[] = [];

		inputs.forEach((input) => {
			const isId: boolean =
				input.type === "text" && input.name === "userId";

			if (!formInputsValue[input.name]) {
				inputErrors.push(`Cannot leave ${input.placeholder} empty`);
				return;
			}

			if (isId) {
				if (!validateInput.id(formInputsValue[input.name])) {
					inputErrors.push(
						'Username can only contain letters, numbers, and "_"'
					);
				}
				inputErrors.push(null);
				return;
			}

			if (
				input.type === "text" &&
				!validateInput.text(formInputsValue[input.name])
			) {
				inputErrors.push("Please enter a valid value");
				return;
			}

			if (
				input.type === "email" &&
				!validateInput.email(formInputsValue[input.name])
			) {
				inputErrors.push("Please enter a valid email address");
				return;
			}

			inputErrors.push(null);
		});

		if (inputErrors.every((error) => error === null)) {
			setFormInputErrors(
				action.callback(...Object.values(formInputsValue))
			);
		} else {
			setFormInputErrors(inputErrors);
		}
	};

	return (
		<form className={className} onSubmit={handleSubmit} noValidate>
			{inputs.map((input, index: number) => {
				return (
					<span key={index}>
						<input
							className={input.className}
							name={input.name}
							type={input.type}
							value={formInputsValue[input.name] ?? ""}
							placeholder={input.placeholder}
							onChange={handleChange}
							onFocus={() => setFormInputErrors([])}
						/>
						<p
							className={`${error.className ?? ""} ${
								!formInputErrors[index] ? "invisible" : ""
							}`}
						>
							{!formInputErrors[index]
								? ""
								: formInputErrors[index]}
						</p>
					</span>
				);
			})}
			<button className={action.className}>{action.text}</button>
		</form>
	);
}
