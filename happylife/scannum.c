#define _CRT_SECURE_NO_WARNING
#include <stdio.h>

int main(){
	int num;
	printf("원하는 숫자를 하나 입력하세요:");
	scanf("%d",&num);
	printf("%d단의 구구단을 출력합니다.\n");
	for(int i=1;i<10;i++){
		printf("%d x %d =%d\n",num,i,num*i);
	}
	printf("출력이 종료되었습니다!!!!!!!!");
	return 0;
}
