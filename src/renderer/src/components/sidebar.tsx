
import React from "react";

import {
	ArrowUp,
	Plus,
	Trash,
	Pencil,
	ArrowDownToLine,
	Ellipsis,
	FolderUp,
	FolderDown
} from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarGroupContent,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarFooter,
	SidebarMenuAction
} from "@renderer/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu"

import { useAtom, useSetAtom } from "jotai";
import { markdownAtom, tmpMarkdownAtom } from "@renderer/atoms/markdownAtoms";
import { selectedIdAtom, targetIdAtom } from "@renderer/atoms/selectedIdAtom";
import { modalShownAtom } from "@renderer/atoms/modalShownAtom";


export function AppSidebar(): React.JSX.Element {

	const [content, setContent] = useAtom(markdownAtom);
	const [selectedId, setDocumentId] = useAtom(selectedIdAtom);
	const [tmpContent, setTmpContent] = useAtom(tmpMarkdownAtom);

	const setModalShown = useSetAtom(modalShownAtom);
	const setTarget = useSetAtom(targetIdAtom);

	const saveContent = () => {
		const updatedContent = content.map((item) =>
			item.id === selectedId ? { ...item, content: tmpContent } : item
		);
		setContent(updatedContent);
	};

	const createNewDocument = () => {
		const newId = `doc-${content.length + 1}`;
		setContent([...content, { id: newId, content: "" }]);
		setDocumentId(newId);
	};

	const onDeleteClick = (id: string) => {
		setTarget(id);
		setModalShown("delete");
	};

	const exportMarkdown = (id: string) => {
		const doc = content.find((item) => item.id === id);
		if (doc) {
			const blob = new Blob([doc.content], { type: "text/markdown" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `${id}.md`;
			a.click();
			URL.revokeObjectURL(url);
		}
	};

	const onDocumentListChange = () => {
		saveContent();
		const doc = content.find((item) => item.id === selectedId);
		if (doc) {
			setTmpContent(doc.content);
		}
	}

	const onEditClick = (id: string) => {
		setTarget(id);
		setModalShown("rename");
	}

	const importButtonClick = () => {
		const input = document.getElementById("__markdown_import_anchor__") as HTMLInputElement;
		input.click();
	}

	const fileInputEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				const text = event.target?.result;
				if (typeof text === "string") {
					let newId = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension
					if (content.find((item) => item.id === newId)) {
						newId = `${newId}-${Date.now()}`;
					}
					setContent([...content, { id: newId, content: text }]);
				}
			};
			reader.readAsText(file);
		}
	}

	const exportMarkdownState = () => {
		const dataStr = JSON.stringify(content, null, 2);
		const blob = new Blob([dataStr], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `state.smed`;
		a.click();
		URL.revokeObjectURL(url);
	}

	const importMarkdownState = () => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".smed, application/json";
		input.onchange = (e: Event) => {
			const target = e.target as HTMLInputElement;
			const file = target.files?.[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = (event) => {
					const text = event.target?.result;
					if (typeof text === "string") {
						try {
							const importedContent = JSON.parse(text);
							if (Array.isArray(importedContent)) {
								setContent(importedContent);
							} else {
								alert("Invalid state file!");
							}
						} catch {
							alert("Error parsing state file!");
						}
					}
				};
				reader.readAsText(file);
			}
		};
		input.click();
	}

	return (
		<Sidebar>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel> Created Markdown Documents </SidebarGroupLabel>
					<SidebarGroupContent>
						{content.map((doc) => (
							<SidebarMenuItem
								key={doc.id}
								onClick={onDocumentListChange}
							>
								<SidebarMenuButton
									onClick={() => setDocumentId(doc.id!)}
								>
									<span>{doc.id || "Untitled Document"}</span>
								</SidebarMenuButton>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<SidebarMenuAction>
											<Ellipsis />
										</SidebarMenuAction>
									</DropdownMenuTrigger>
									<DropdownMenuContent side="right" align="start">
										<DropdownMenuLabel>Actions</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											onClick={() => onEditClick(doc.id!)}
										>
											<Pencil />
											<span>Edit Document Name</span>
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => exportMarkdown(doc.id!)}
										>
											<ArrowDownToLine />
											<span>Export as Markdown</span>
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											onClick={() => onDeleteClick(doc.id!)}
										>
											<Trash />
											<span>Delete Document</span>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</SidebarMenuItem>
						))}
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarGroup>
					<SidebarGroupLabel> Add / Import Documents </SidebarGroupLabel>
					<SidebarMenuButton
						onClick={createNewDocument}
					>
						<Plus />
						New Document
					</SidebarMenuButton>
					<input
						type="file"
						accept=".md, .markdown, text/markdown"
						style={{ display: "none" }}
						id="__markdown_import_anchor__"
						onChange={fileInputEvent}
					/>
					<SidebarMenuButton
						onClick={importButtonClick}
					>
						<ArrowUp />
						Import Document
					</SidebarMenuButton>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupLabel> Export / Import States </SidebarGroupLabel>
					<SidebarMenuButton
						onClick={exportMarkdownState}
					>
						<FolderUp />
						Export Editor State
					</SidebarMenuButton>
					<SidebarMenuButton
						onClick={importMarkdownState}
					>
						<FolderDown />
						Import Editor State
					</SidebarMenuButton>
				</SidebarGroup>
			</SidebarFooter>
		</Sidebar>
	)
}
