
// push start
@111
D=A


@SP
A=M
M=D
@SP
M=M+1
// push done

// push start
@333
D=A


@SP
A=M
M=D
@SP
M=M+1
// push done

// push start
@888
D=A


@SP
A=M
M=D
@SP
M=M+1
// push done

// pop start
@StaticTest.8
D=A  // addr
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

// pop start
@StaticTest.3
D=A  // addr
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

// pop start
@StaticTest.1
D=A  // addr
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
@StaticTest.3
D=A 
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1
// push done

// push start
@StaticTest.1
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
@StaticTest.8
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
