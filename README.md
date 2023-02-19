# InstantGDB

Typically, in VSCode, debugging a C++ executable requires you to create a launch.json file where you specify your debug configuration. So you can avoid doing that, this extension will automatically generate a debug configuration based on the command that you would use to run your executable on the command line, and invoke the debugger GDB using it.

## Usage

0. Make sure you have GDB installed; it comes with the compiler g++ on most systems.

1. Create your executable using a compiler like Clang or g++. Make sure to use the `-g` flag.

```bash
g++ -g myclass.cpp mymain.cpp -o myprogram
```

Or:

```bash
# make sure -g is in your CPPFLAGS or similar in the makefile
make debug
```

2. Add breakpoints to your source code by clicking on the space to the left of the line numbers.

3. Hit F1 or Ctrl-Shift-P to bring up the VSCode command palette; type InstantGDB and choose the option to "Run executable with GDB"

4. Enter the command that you would use to run your executable normally, such as `./myprogram myinputfile.txt logdest.txt`

That should do it.
