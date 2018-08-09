webgl_display
=============
Helper library for rendering WebGL objects within the browser. This is a higher-level API built on top of
@nfactorial/webgl_helper, providing more structure to the rendering of a WebGL display.

This library is still in early development.

This library is not intended to provide a full rendering framework, there will not be any scene management or
built-in shadow support. The goal of this library is to provide a core foundation on which these features can be
added, itself extending the raw WebGLHelper library.

Rendering Pipeline
==================
The rendering pipeline is split into several stages.