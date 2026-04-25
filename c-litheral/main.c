#include <stdio.h>
#include <string.h>

#define N 100
#define pi 3.14
#define C 'k'
#define STR "HANSUNG"
int main(){
	int i;
	double d;
	char c;
	char str[32];

	i=N;
	d=pi;
	c=C;
	strcpy(str,STR);

	printf("i=%d\n",i);
	printf("d=%.3lf\n",d);
	return 0;
}
