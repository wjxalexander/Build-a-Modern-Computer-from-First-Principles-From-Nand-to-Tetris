
// push start
@17
D=A
@SP
A=M
M=D
@SP
M=M+1
// push done

// push start
@17
D=A
@SP
A=M
M=D
@SP
M=M+1
// push done
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
D;JEQ
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


// push start
@17
D=A
@SP
A=M
M=D
@SP
M=M+1
// push done

// push start
@16
D=A
@SP
A=M
M=D
@SP
M=M+1
// push done
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
@TRUE1
D;JEQ
@FALSE1
0;JMP
(TRUE1)
@R13
AD=M
M=-1
@SP
M=D+1
@NEXT1
0;JMP
(FALSE1)
@R13
AD=M
M=0
@SP
M=D+1
@NEXT1
0;JMP
(NEXT1)


// push start
@16
D=A
@SP
A=M
M=D
@SP
M=M+1
// push done

// push start
@17
D=A
@SP
A=M
M=D
@SP
M=M+1
// push done
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
@TRUE2
D;JEQ
@FALSE2
0;JMP
(TRUE2)
@R13
AD=M
M=-1
@SP
M=D+1
@NEXT2
0;JMP
(FALSE2)
@R13
AD=M
M=0
@SP
M=D+1
@NEXT2
0;JMP
(NEXT2)


// push start
@892
D=A
@SP
A=M
M=D
@SP
M=M+1
// push done

// push start
@891
D=A
@SP
A=M
M=D
@SP
M=M+1
// push done
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
@TRUE3
D;JLT
@FALSE3
0;JMP
(TRUE3)
@R13
AD=M
M=-1
@SP
M=D+1
@NEXT3
0;JMP
(FALSE3)
@R13
AD=M
M=0
@SP
M=D+1
@NEXT3
0;JMP
(NEXT3)


// push start
@891
D=A
@SP
A=M
M=D
@SP
M=M+1
// push done

// push start
@892
D=A
@SP
A=M
M=D
@SP
M=M+1
// push done
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
@TRUE4
D;JLT
@FALSE4
0;JMP
(TRUE4)
@R13
AD=M
M=-1
@SP
M=D+1
@NEXT4
0;JMP
(FALSE4)
@R13
AD=M
M=0
@SP
M=D+1
@NEXT4
0;JMP
(NEXT4)


// push start
@891
D=A
@SP
A=M
M=D
@SP
M=M+1
// push done

// push start
@891
D=A
@SP
A=M
M=D
@SP
M=M+1
// push done
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
@TRUE5
D;JLT
@FALSE5
0;JMP
(TRUE5)
@R13
AD=M
M=-1
@SP
M=D+1
@NEXT5
0;JMP
(FALSE5)
@R13
AD=M
M=0
@SP
M=D+1
@NEXT5
0;JMP
(NEXT5)


// push start
@32767
D=A
@SP
A=M
M=D
@SP
M=M+1
// push done

// push start
@32766
D=A
@SP
A=M
M=D
@SP
M=M+1
// push done
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
@TRUE6
D;JGT
@FALSE6
0;JMP
(TRUE6)
@R13
AD=M
M=-1
@SP
M=D+1
@NEXT6
0;JMP
(FALSE6)
@R13
AD=M
M=0
@SP
M=D+1
@NEXT6
0;JMP
(NEXT6)


// push start
@32766
D=A
@SP
A=M
M=D
@SP
M=M+1
// push done

// push start
@32767
D=A
@SP
A=M
M=D
@SP
M=M+1
// push done
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
@TRUE7
D;JGT
@FALSE7
0;JMP
(TRUE7)
@R13
AD=M
M=-1
@SP
M=D+1
@NEXT7
0;JMP
(FALSE7)
@R13
AD=M
M=0
@SP
M=D+1
@NEXT7
0;JMP
(NEXT7)


// push start
@32766
D=A
@SP
A=M
M=D
@SP
M=M+1
// push done

// push start
@32766
D=A
@SP
A=M
M=D
@SP
M=M+1
// push done
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
@TRUE8
D;JGT
@FALSE8
0;JMP
(TRUE8)
@R13
AD=M
M=-1
@SP
M=D+1
@NEXT8
0;JMP
(FALSE8)
@R13
AD=M
M=0
@SP
M=D+1
@NEXT8
0;JMP
(NEXT8)


// push start
@57
D=A
@SP
A=M
M=D
@SP
M=M+1
// push done

// push start
@31
D=A
@SP
A=M
M=D
@SP
M=M+1
// push done

// push start
@53
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

// push start
@112
D=A
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
@SP
A=M-1
M=-M
//neg done

@SP
A=M-1
D=M
A=A-1
M=D&M
D=A+1
@SP
M=D
//or done


// push start
@82
D=A
@SP
A=M
M=D
@SP
M=M+1
// push done
@SP
A=M-1
D=M
A=A-1
M=D|M
D=A+1
@SP
M=D
//or done

@SP
A=M-1
M=!M
//not done

