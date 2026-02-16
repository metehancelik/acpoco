"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const SCROLL_THRESHOLD = 300;
const MAIN_SCROLL_ID = "main-scroll";
const CONTENT_SCROLL_ID = "content-scroll";

function getScrollTop(container: HTMLElement | null): number {
	if (typeof window === "undefined") return 0;
	if (container) return container.scrollTop;
	return window.scrollY ?? document.documentElement.scrollTop ?? 0;
}

export default function BackToTop() {
	const [visible, setVisible] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) return;
		const updateVisible = () => {
			const top = Math.max(
				getScrollTop(document.getElementById(MAIN_SCROLL_ID)),
				getScrollTop(document.getElementById(CONTENT_SCROLL_ID)),
				getScrollTop(null),
			);
			setVisible(top > SCROLL_THRESHOLD);
		};
		updateVisible();
		const mainScroll = document.getElementById(MAIN_SCROLL_ID);
		const contentScroll = document.getElementById(CONTENT_SCROLL_ID);
		if (mainScroll)
			mainScroll.addEventListener("scroll", updateVisible, { passive: true });
		if (contentScroll)
			contentScroll.addEventListener("scroll", updateVisible, {
				passive: true,
			});
		window.addEventListener("scroll", updateVisible, { passive: true });
		return () => {
			const m = document.getElementById(MAIN_SCROLL_ID);
			const c = document.getElementById(CONTENT_SCROLL_ID);
			if (m) m.removeEventListener("scroll", updateVisible);
			if (c) c.removeEventListener("scroll", updateVisible);
			window.removeEventListener("scroll", updateVisible);
		};
	}, [mounted]);

	const scrollToTop = () => {
		const mainScroll = document.getElementById(MAIN_SCROLL_ID);
		const contentScroll = document.getElementById(CONTENT_SCROLL_ID);
		if (mainScroll) mainScroll.scrollTo({ top: 0, behavior: "smooth" });
		if (contentScroll) contentScroll.scrollTo({ top: 0, behavior: "smooth" });
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	if (!mounted || !visible) return null;

	const button = (
		<button
			type="button"
			onClick={scrollToTop}
			className="fixed bottom-6 right-6 z-9999 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-r from-gold to-amber-500 text-white shadow-lg shadow-amber-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/40 hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 cursor-pointer active:scale-95 motion-reduce:transition-none"
			aria-label="Back to top"
		>
			<ArrowUp className="h-5 w-5 shrink-0" aria-hidden />
		</button>
	);

	return createPortal(button, document.body);
}
