export default function DocsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				<title>API Documentation</title>
			</head>
			<body>{children}</body>
		</html>
	);
}
