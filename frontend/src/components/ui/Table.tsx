type Props = {
    headers: string[];
    children: React.ReactNode;
}

function Table({ headers, children }: Props) {
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                    <tr>
                        {headers.map((h) => (
                            <th className="px-4 py-3 font-medium" key={h}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {children}
                </tbody>
            </table>
        </div>
    );
}

export default Table;
