import React from "react";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

const API_URL = import.meta.env.VITE_API_URL;

type TAccount = {
	id: string;
	user_id: string;
	currency: string;
	created_at: string;
};

type TransactionModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onTransactionSuccess: () => void;
	type: "DEPOSIT" | "WITHDRAWAL";
	accounts: TAccount[];
};

export function TransactionModal({
	open,
	onOpenChange,
	onTransactionSuccess,
	type,
	accounts,
}: TransactionModalProps) {
	const [selectedAccount, setSelectedAccount] = React.useState<string | undefined>(undefined);
	const [amount, setAmount] = React.useState<string>("");
	const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

	const handleTransaction = async () => {
		if (!selectedAccount) {
			toast.error("Please select an account.");
			return;
		}

		const parsedAmount = parseFloat(amount);
		if (isNaN(parsedAmount) || parsedAmount <= 0) {
			toast.error("Please enter a valid amount.");
			return;
		}

		setIsSubmitting(true);
		const token = localStorage.getItem("jwt");
		if (!token) {
			toast.error("Authentication token not found.");
			setIsSubmitting(false);
			return;
		}

		try {
			const response = await fetch(
				`${API_URL}accounts/${selectedAccount}/transactions`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						type: type,
						amount: parsedAmount,
						reference: `${type.toLowerCase()}-via-app-${Date.now()}`,
					}),
				}
			);

			if (response.ok) {
				toast.success(`${type} successful!`);
				onTransactionSuccess();
				onOpenChange(false);
				setAmount("");
				setSelectedAccount(undefined);
			} else {
				const errorData = await response.json();
				toast.error(errorData.message || `Failed to ${type.toLowerCase()}.`);
			}
		} catch (error) {
			toast.error(`An error occurred during ${type.toLowerCase()}.`);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{type === "DEPOSIT" ? "Deposit Funds" : "Withdraw Funds"}</DialogTitle>
					<DialogDescription>
						Select an account and enter the amount to {type.toLowerCase()}.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="account" className="text-right">
							Account
						</Label>
						<Select onValueChange={setSelectedAccount} value={selectedAccount}>
							<SelectTrigger className="col-span-3">
								<SelectValue placeholder="Select an account" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Your Accounts</SelectLabel>
									{accounts.map((account) => (
										<SelectItem key={account.id} value={account.id}>
											Account ••••{account.id.slice(-4)} ({account.currency})
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="amount" className="text-right">
							Amount
						</Label>
						<Input
							id="amount"
							type="number"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							className="col-span-3"
						/>
					</div>
				</div>
				<DialogFooter>
					<Button type="submit" onClick={handleTransaction} disabled={isSubmitting}>
						{isSubmitting ? "Processing..." : "Proceed"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
