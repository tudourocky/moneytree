import React, { useState } from "react";

export default function ExpenseOverview({ data }) {
	return (
		<div>
			<ExpenseOverviewCard data={data}/>
			<ExpenseOverviewCard data={data}/>
		</div>
	);
}

function ExpenseOverviewCard({data}) {
	return (
		<div>
			<div>
				<div>{"date"}</div>
				<div>{"category"}</div>
				<div>{"price"}</div>
			</div>
			<div>
				<div>{"critque"}</div>
				<div>{"description"}</div>
			</div>
		</div>
	);
}
