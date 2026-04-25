#include <stdio.h>

double list_avg(int *arr, int size) {
    if (size == 0) return 0;
    int sum = 0;
    for (int i = 0; i < size; i++) {
        sum += arr[i];
    }
    return (double)sum / size;
}

int main() {
    int arr[] = {1, 2, 3, 4, 5};
    int size = sizeof(arr) / sizeof(arr[0]);
    printf("리스트의 평균: %.2f\n", list_avg(arr, size));
    return 0;
}
#include <stdlib.h>
#include <stddef.h>

// 정수���을 구하는 함수
double list_avg(const int *list, size_t len) {
    if (list == NULL || len == 0) {
        return 0.0;
    }
    long long sum = 0;
    for (size_t i = 0; i < len; ++i) {
        sum += list[i];
    }
    return (double)sum / len;
}

int main(void) {
    size_t n;

    printf("정수 개수: ");
    if (scanf("%zu", &n) != 1) {
        fprintf(stderr, "오류: 입력이 비었거나 ���니다.\n");
        return 1;
    }
    if (n == 0) {
        fprintf(stderr, "오류: 개수는 1 이상�니다.\n");
        return 1;
    }

    int *arr = (int *)malloc(n * sizeof *arr);
    if (arr == NULL) {
        fprintf(stderr, "오류: 메모리 할당에 실패했습니다.\n");
        return 1;
    }

    printf("%zu개의 정수를 입력하세요: ", n);
    for (size_t i = 0; i < n; ++i) {
        if (scanf("%d", &arr[i]) != 1) {
            fprintf(stderr, "오류: 입력이 중단되었습니다. (%zu번째 값)\n", i + 1);
            free(arr);
            return 1;
        }
    }

    double avg = list_avg(arr, n);
    printf�: %.2f\n", avg);
    free(arr);
    return 0;
}
