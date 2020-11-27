
@111
D=A


@SP
A=M
M=D
@SP
M=M+1


@333
D=A


@SP
A=M
M=D
@SP
M=M+1


@888
D=A


@SP
A=M
M=D
@SP
M=M+1


@StaticTest.8
D=A
@R14
M=D
@SP
M=M-1
A=M
D=M
@R14
A=M
M=D
@R14
M=0


@StaticTest.3
D=A
@R14
M=D
@SP
M=M-1
A=M
D=M
@R14
A=M
M=D
@R14
M=0


@StaticTest.1
D=A
@R14
M=D
@SP
M=M-1
A=M
D=M
@R14
A=M
M=D
@R14
M=0


@StaticTest.3
D=A
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1


@StaticTest.1
D=A
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1


@SP
A=M-1
D=M
A=A-1
M=M-D
D=A+1
@SP
M=D


@StaticTest.8
D=A
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1


@SP
A=M-1
D=M
A=A-1
M=D+M
D=A+1
@SP
M=D

