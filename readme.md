webgl_display
=============
Helper library for rendering WebGL objects within the browser. This is a higher-level API built on top of
@nfactorial/webgl_helper, providing more structure to the rendering of a WebGL display.

This library is still in early development.

This library is not intended to provide a full rendering framework, there will not be any scene management or
built-in shadow support. The goal of this library is to provide a core foundation on which these features can be
added, itself extending the raw WebGLHelper library.

Another WebGL Wrapper?
======================
Libraries such as ThreeJs and Babylon are already available, so why create another one?

I needed a little more low-level control over the rendering pipeline, I was writing a game that contained
terrain tiles. I found that I could determine which tiles were visible easily without the need of the
rendering framework performing culling for me. It was quite trivial to disable frustum culling for the
object however that pipe is still in the framework and the status is still checked for each object.
As I progressed through the development, I found that just about all my objects could detect whether or not
they needed to be rendered.

When it came time to add post-processing to the title, I found no built-in support for it. Worse than that,
to render a full-screen post process I needed to create an entire scene for the polygon. I wanted this to
be a first-class citizen of the framework with minimal overhead. It was at this point I started to consider
my own wrapper. 

If you want to just jump-in and start creating games or demos without worrying too much about these extra
things, then I think the other available libraries are a much better option for you. You can jump-in and
get a bunch of features immediately at your finger tips.

This library is mostly due to my own desire for more control over the rendering pipeline that I can build
more specialized applications on top of.

Rendering Pipeline
==================
The rendering pipeline is split into several stages.