/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import fs from "node:fs";
import { Config } from "@remotion/cli/config";

Config.setRspack(true);
// PNG gera o vídeo em yuv420p (faixa de cor padrão); com JPEG sai yuvj420p, que algumas plataformas mostram lavado
Config.setVideoImageFormat("png");
Config.setOverwriteOutput(true);

// Neste ambiente o Remotion não consegue baixar o navegador; usa o Chromium já instalado.
const chromiumLocal =
  "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
if (fs.existsSync(chromiumLocal)) {
  Config.setBrowserExecutable(chromiumLocal);
}
