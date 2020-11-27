
// push start
@7
D=A
@SP
A=M
M=D
@SP
M=M+1
// push done

// push start
@8
D=A
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
