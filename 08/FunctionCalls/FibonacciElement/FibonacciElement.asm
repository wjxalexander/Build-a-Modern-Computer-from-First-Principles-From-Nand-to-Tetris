@256
D=A
@SP
M=D
@Sys.init$RET.1
D=A
@SP
A=M
M=D
@SP
M=M+1
@LCL
D=M
@SP
A=M
M=D
@SP
M=M+1
@ARG
D=M
@SP
A=M
M=D
@SP
M=M+1
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
@5
D=A
@0
D=D+A
@SP
A=M
D=A-D
@ARG
M=D
@SP
D=M
@LCL
M=D
@Sys.init
0;JMP
(Sys.init$RET.1)
//initdone
(Sys.init)

@4
D=A

@SP
A=M
M=D
@SP
M=M+1
@Main.fibonacci$RET.1
D=A
@SP
A=M
M=D
@SP
M=M+1
@LCL
D=M
@SP
A=M
M=D
@SP
M=M+1
@ARG
D=M
@SP
A=M
M=D
@SP
M=M+1
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
@5
D=A
@1
D=D+A
@SP
A=M
D=A-D
@ARG
M=D
@SP
D=M
@LCL
M=D
@Main.fibonacci
0;JMP
(Main.fibonacci$RET.1)

(WHILE)
@WHILE
0;JMP
(Main.fibonacci)

@0
D=A
@ARG
A=M+D
D=A
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1
@2
D=A

@SP
A=M
M=D
@SP
M=M+1
@SP
AM=M-1
D=M
@SP
AM=M-1
M=M-D
D=A
@R13
M=D
@SP
A=M
D=M
@TRUE0
D;JLT
@FALSE0
0;JMP
(TRUE0)
@R13
AD=M
M=-1
@SP
M=D+1
@NEXT0
0;JMP
(FALSE0)
@R13
AD=M
M=0
@SP
M=D+1
@NEXT0
0;JMP
(NEXT0)

@SP
AM=M-1
D=M
@IF_TRUE
D;JNE
@IF_FALSE
0;JMP
(IF_TRUE)
@0
D=A
@ARG
A=M+D
D=A
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1
@LCL
D=M
@ENDFRAME
M=D
@5
A=D-A
D=M
@RETURNADDRESS
M=D
@SP
A=M-1
D=M
@ARG
A=M
M=D
@ARG
D=M+1
@SP
M=D
@ENDFRAME
D=M
@1
A=D-A
D=M
@THAT
M=D
@ENDFRAME
D=M
@2
A=D-A
D=M
@THIS
M=D
@ENDFRAME
D=M
@3
A=D-A
D=M
@ARG
M=D
@ENDFRAME
D=M
@4
A=D-A
D=M
@LCL
M=D
@RETURNADDRESS
A=M
0;JMP

(IF_FALSE)
@0
D=A
@ARG
A=M+D
D=A
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1
@2
D=A

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

@Main.fibonacci$RET.2
D=A
@SP
A=M
M=D
@SP
M=M+1
@LCL
D=M
@SP
A=M
M=D
@SP
M=M+1
@ARG
D=M
@SP
A=M
M=D
@SP
M=M+1
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
@5
D=A
@1
D=D+A
@SP
A=M
D=A-D
@ARG
M=D
@SP
D=M
@LCL
M=D
@Main.fibonacci
0;JMP
(Main.fibonacci$RET.2)

@0
D=A
@ARG
A=M+D
D=A
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1
@1
D=A

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

@Main.fibonacci$RET.3
D=A
@SP
A=M
M=D
@SP
M=M+1
@LCL
D=M
@SP
A=M
M=D
@SP
M=M+1
@ARG
D=M
@SP
A=M
M=D
@SP
M=M+1
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
@5
D=A
@1
D=D+A
@SP
A=M
D=A-D
@ARG
M=D
@SP
D=M
@LCL
M=D
@Main.fibonacci
0;JMP
(Main.fibonacci$RET.3)

@SP
A=M-1
D=M
A=A-1
M=D+M
D=A+1
@SP
M=D // add done

@LCL
D=M
@ENDFRAME
M=D
@5
A=D-A
D=M
@RETURNADDRESS
M=D
@SP
A=M-1
D=M
@ARG
A=M
M=D
@ARG
D=M+1
@SP
M=D
@ENDFRAME
D=M
@1
A=D-A
D=M
@THAT
M=D
@ENDFRAME
D=M
@2
A=D-A
D=M
@THIS
M=D
@ENDFRAME
D=M
@3
A=D-A
D=M
@ARG
M=D
@ENDFRAME
D=M
@4
A=D-A
D=M
@LCL
M=D
@RETURNADDRESS
A=M
0;JMP

