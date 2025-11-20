import { Providers } from "@/components/Providers";
import { NotificationProvider } from "@/context/NotificationContext";

export default function RootLayout({
	children,
	params: { locale },
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	return (
		<html lang={locale}>
			<body>
				<Providers>
					<NotificationProvider>{children}</NotificationProvider>
				</Providers>
			</body>
		</html>
	);
}
