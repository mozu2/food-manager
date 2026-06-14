type Props = {
    headers: string[];
    children: React.ReactNode;
}


function Table({ headers, children }: Props) {

    return (
        <table className="table-auto border-collapse w-full">
            <thead className="bg-gray-100">
                <tr>
                    {headers.map((h) => (
                        <th className="border px-4 py-2" key={h}>{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody className="border px-4 py-2">{children}</tbody>
        </table>
    )
};
export default Table;


