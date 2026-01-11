import * as vscode from "vscode";

const STYLE_EXTS = [".module.css", ".css", ".module.scss", ".scss", ".module.sass", ".sass", ".less"];
const CODE_EXTS  = [".tsx", ".ts", ".jsx", ".js"];

function getExtType(fileNameLower: string): "style" | "code" | "unknown" {
  if (STYLE_EXTS.some(e => fileNameLower.endsWith(e))) return "style";
  if (CODE_EXTS.some(e => fileNameLower.endsWith(e))) return "code";
  return "unknown";
}

function stripKnownExt(fileName: string): string {
  const lower = fileName.toLowerCase();
  for (const e of [...STYLE_EXTS, ...CODE_EXTS]) {
    if (lower.endsWith(e)) return fileName.slice(0, -e.length);
  }
  const idx = fileName.lastIndexOf(".");
  return idx === -1 ? fileName : fileName.slice(0, idx);
}

async function exists(p: string): Promise<boolean> {
  try {
    await vscode.workspace.fs.stat(vscode.Uri.file(p));
    return true;
  } catch {
    return false;
  }
}

export function activate(context: vscode.ExtensionContext) {
  const cmd = vscode.commands.registerCommand("reactCodebehind.toggle", async () => {
    const ed = vscode.window.activeTextEditor;
    if (!ed) return;

    const currentFsPath = ed.document.uri.fsPath;
    if (ed.document.uri.scheme !== "file") {
      vscode.window.showInformationMessage("Toggle only works with local files.");
      return;
    }

    const parts = currentFsPath.split(/[/\\]/);
    const fileName = parts.pop()!;
    const dir = parts.join(require("path").sep) + require("path").sep;

    const base = stripKnownExt(fileName);
    const type = getExtType(fileName.toLowerCase());

    const preferred = type === "style" ? CODE_EXTS : STYLE_EXTS;
    const secondary = type === "style" ? STYLE_EXTS : CODE_EXTS;

    const candidates = [...preferred, ...secondary].map(ext => dir + base + ext);

    for (const p of candidates) {
      if (p === currentFsPath) continue;
      if (await exists(p)) {
        await vscode.window.showTextDocument(vscode.Uri.file(p), {
          viewColumn: ed.viewColumn,
          preview: false
        });
        return;
      }
    }

    vscode.window.showWarningMessage(`No paired file found for: ${base} (CSS/SCSS ↔ JSX/TSX).`);
  });

  context.subscriptions.push(cmd);
}

export function deactivate() {}
