
// push start
@3030
D=A


@SP
A=M
M=D
@SP
M=M+1
// push done

// pop start
@3
D = A // addr
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
// pop done

// push start
@3040
D=A


@SP
A=M
M=D
@SP
M=M+1
// push done

// pop start
@4
D = A // addr
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
// pop done

// push start
@32
D=A


@SP
A=M
M=D
@SP
M=M+1
// push done

// pop start
@2
D=A
@THIS
A=M+D
D=A // addr
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
// pop done

// push start
@46
D=A


@SP
A=M
M=D
@SP
M=M+1
// push done

// pop start
@6
D=A
@THAT
A=M+D
D=A // addr
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
// pop done

// push start
@3
D = A
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1
// push done

// push start
@4
D = A
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1
// push done

// add start
@SP
A=M-1
D=M
A=A-1
M=D+M
D=A+1
@SP
M=D
//add done

// push start
@2
D=A
@THIS
A=M+D
D=A
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1
// push done

// sub start
@SP
A=M-1
D=M
A=A-1
M=M-D
D=A+1
@SP
M=D
//sub done

// push start
@6
D=A
@THAT
A=M+D
D=A
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1
// push done

// add start
@SP
A=M-1
D=M
A=A-1
M=D+M
D=A+1
@SP
M=D
//add done
