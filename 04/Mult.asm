// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)

// Put your code here.
@temp
M=0 // temp = 0
@i // i=0
M=0
(LOOP)
@i
D=M
@R1
D=D-M
@TOFINAL
D;JEQ // i==R1 jump

@R0
D=M
@temp
M=D+M
@i // i++
M=M+1

@LOOP
0;JMP

(TOFINAL)
@temp
D=M
@R2
M=D
@END
0;JMP

(END)
@END
0;JMP


