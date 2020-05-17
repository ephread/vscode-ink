# Ink extension for Visual Studio Code

This extensions adds language support for [inkle's ink].

⚠️ The extension is under heavy development and is not available yet on the marketplace.

[inkle's ink]: https://github.com/inkle/ink

## Language Features

- Syntax highlighting using the [updated TextMate grammar].
- Diagnostics (errors, warning and author's notes) through [inklecate] (inklecate must be installed separately).

[updated TextMate grammar]: https://github.com/inkle/ink-tmlanguage
[inklecate]: https://github.com/ephread/ink/tree/language-server/inklecate/LanguageServerProtocol

## Configuration settings

The server supports three configuration settings.

- `ink.useLanguageServer`: use the experimental language server (this feature requires a version of
  [inklecate with LSP support], see [Quickstart] for more information).
- `ink.languageServer.mainFilePath`: the path to the main ink file, used by inklecate to build the story.
   If it's not provided, the extension will treat the current file in isolation.
- `ink.languageServer.inklecatePath`: the path to the inklecate. If inklecate is accessible in `$PATH`, you can set it to `inklecate`.
- `ink.languageServer.useSpecificRuntime`: whether to use a .NET runtime to execute `inklecate`; possible values are:
    - `none`: use no specific runtime (only available on Windows);
    - `mono`: use Mono runtime;
    - `dotnet`: use .NET Core runtime.

[Quickstart]: #quickstart
[inklecate with LSP support]: https://github.com/ephread/ink/tree/language-server/inklecate/LanguageServerProtocol

## Installing

### Quickstart

1. Clone the project
2. Run `npm install`
3. Run the configuration named `Run Extension (Debug)`
4. Set the configuration settings (see below)

### Language Server Support

⚠️ This has only been tested on macOS with Visual Studio for Mac.

1. Clone this [fork of ink].
2. Check out the branch named `language-server`.
3. Build the project (using the Debug configuration).
4. Grab the path to `inklecate.dll` and set it to `ink.languageServer.inklecatePath`.
   By default it should be at:
```
<root-of-repository>/inklecate/bin/Debug/netcoreapp3.1/inklecate.dll
```
4. If you're building using Visual Studio for Mac and keeping the default configuration,
`dotnet` is a better choice than `mono` for `ink.languageServer.useSpecificRuntime`
(although both should work).
5. Enable `ink.useLanguageServer`.

[fork of ink]: https://github.com/ephread/ink/

## License

This extension is released under the MIT license. See LICENSE for details.
