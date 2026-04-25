#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>

int get_your_age() {
	int age;

	printf("input your age:");
	scanf("%d",&age);

	return age;
}