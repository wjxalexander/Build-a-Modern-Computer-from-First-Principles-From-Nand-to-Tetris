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

@6
D=A

@SP
A=M
M=D
@SP
M=M+1
@8
D=A

@SP
A=M
M=D
@SP
M=M+1
@Class1.set$RET.1
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
@2
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
@Class1.set
0;JMP
(Class1.set$RET.1)

@5
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
@23
D=A

@SP
A=M
M=D
@SP
M=M+1
@15
D=A

@SP
A=M
M=D
@SP
M=M+1
@Class2.set$RET.1
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
@2
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
@Class2.set
0;JMP
(Class2.set$RET.1)

@5
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
@Class1.get$RET.1
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
@Class1.get
0;JMP
(Class1.get$RET.1)

@Class2.get$RET.1
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
@Class2.get
0;JMP
(Class2.get$RET.1)

(WHILE)
@WHILE
0;JMP
(Class2.set)

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
@Class2.vm.0
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
@1
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
@Class2.vm.1
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
@0
D=A

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

(Class2.get)

@Class2.vm.0
D=A
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1
@Class2.vm.1
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

(Class1.set)

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
@Class1.vm.0
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
@1
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
@Class1.vm.1
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
@0
D=A

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

(Class1.get)

@Class1.vm.0
D=A
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1
@Class1.vm.1
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
