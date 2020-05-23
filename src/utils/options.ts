import postcss from "postcss";
import {
  LoadersOptions,
  Options,
  PostCSSLoaderOptions,
  SASSLoaderOptions,
  StylusLoaderOptions,
  LESSLoaderOptions,
} from "../types";
import { nullishFilter, isNullish } from "./filter";

export function inferOption<T, TDef extends T | boolean>(
  option: T | boolean | undefined,
  defaultValue: TDef,
): T | false | TDef {
  if (typeof option === "boolean") return option && ({} as TDef);
  if (typeof option === "object") return option;
  return defaultValue;
}

interface Mode {
  inject: PostCSSLoaderOptions["inject"];
  extract: PostCSSLoaderOptions["extract"];
  emit: PostCSSLoaderOptions["emit"];
}
export function inferModeOption(mode: Options["mode"]): Mode {
  const m = Array.isArray(mode)
    ? {
        inject: mode[0] === "inject" && (mode[1] ?? true),
        extract: mode[0] === "extract" && (mode[1] ?? true),
        emit: mode[0] === "emit",
      }
    : {
        inject: mode === "inject",
        extract: mode === "extract",
        emit: mode === "emit",
      };
  if (!(m.inject || m.extract || m.emit)) m.inject = true;
  return m;
}

export function inferHandlerOption<T extends { alias?: Record<string, string> }>(
  option: T | boolean | undefined,
  alias: T["alias"],
): T | false {
  const opt = inferOption(option, { alias } as T);
  if (typeof opt === "object" && !opt.alias) opt.alias = alias;
  return opt;
}

interface UseOpts {
  sass?: SASSLoaderOptions;
  less?: LESSLoaderOptions;
  stylus?: StylusLoaderOptions;
}
export function ensureUseOption(use: Options["use"], opts: UseOpts): LoadersOptions["use"] {
  const all: Record<string, [string, Record<string, unknown>]> = {
    sass: ["sass", opts.sass ?? {}],
    less: ["less", opts.less ?? {}],
    stylus: ["stylus", opts.stylus ?? {}],
  };
  if (!Array.isArray(use)) return Object.values(all);
  return use.map(loader => all[loader] ?? loader);
}

type PCSSOption = "parser" | "syntax" | "stringifier" | "plugin";
export function ensurePCSSOption<T>(option: T | string, type: PCSSOption): T {
  if (typeof option !== "string") return option;
  try {
    return require(option) as T;
  } catch {
    throw new Error(`Unable to load PostCSS ${type} \`${option}\``);
  }
}

export function ensurePCSSPlugins(plugins: Options["plugins"]): postcss.Transformer[] | undefined {
  if (!Array.isArray(plugins)) return ensurePCSSOption(plugins, "plugin");
  return plugins
    .map(p => {
      if (isNullish(p)) return;
      if (!Array.isArray(p)) return ensurePCSSOption(p, "plugin");
      const [plug, opts] = p;
      if (!opts) return ensurePCSSOption<postcss.Transformer>(plug, "plugin");
      return ensurePCSSOption<postcss.Plugin<unknown>>(plug, "plugin")(opts);
    })
    .filter(nullishFilter);
}