#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <errno.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <time.h>
#include <sys/mman.h>
#include <pthread.h>


// Helper function for creating binary tree of threads
void* createBinaryTree(void* arg);
uint32_t jenkins_one_at_a_time_hash(const uint8_t*, uint64_t);

// Structure for passing arguments to threads
struct ThreadArgs {
    uint8_t* arr;
    uint64_t startBlock;
    uint64_t blocks;
};

// Structure for representing a thread in the pool
struct ThreadPool {
    pthread_t* threads;
    int numThreads;
    int nextThreadIndex;
    pthread_mutex_t lock;
};

// Global variable to store final hash value
uint32_t finalHash = 0;

// block size
#define BSIZE 4096

int main(int argc, char** argv) {
    int32_t fd;
    uint64_t nblocks;

    // input checking
    if (argc != 3) {
        fprintf(stderr, "Usage: %s filename num_threads \n", argv[0]);
        exit(EXIT_FAILURE);
    }

    // open input file
    fd = open(argv[1], O_RDWR);
    if (fd == -1) {
        perror("open failed");
        exit(EXIT_FAILURE);
    }

    struct stat fileStat;
    if (fstat(fd, &fileStat) == -1) {
        perror("stat failed");
        exit(EXIT_FAILURE);
    }

    // Number of bytes in the file
    uint64_t fileSize = fileStat.st_size;
    nblocks = fileSize / BSIZE;
    int nthreads = atoi(argv[2]);

    // Ensure at least one block per thread
    if (nthreads > nblocks) {
        fprintf(stderr, "Error: More threads than blocks\n");
        exit(EXIT_FAILURE);
    }

    // Using arr[index] to access index byte
    uint8_t* arr = (uint8_t*)mmap(NULL, fileSize, PROT_READ, MAP_PRIVATE, fd, 0);

    if (arr == MAP_FAILED) {
        perror("Mapping Failed");
        exit(EXIT_FAILURE);
    }

    printf("num Threads = %d\n", nthreads);
    printf("Blocks per Thread = %ld\n", nblocks / nthreads);

    // Create thread pool
    struct ThreadPool threadPool;
    threadPool.numThreads = nthreads;
    threadPool.nextThreadIndex = 0;
    threadPool.threads = (pthread_t*)malloc(sizeof(pthread_t) * nthreads);
    if (threadPool.threads == NULL) {
        perror("Failed to allocate memory for threads");
        munmap(arr, fileSize);
        close(fd);
        exit(EXIT_FAILURE);
    }
    pthread_mutex_init(&threadPool.lock, NULL);

    // Divide blocks among threads to form a complete binary tree
    uint64_t blocksPerThread = nblocks / nthreads;
    uint64_t extraBlocks = nblocks % nthreads;
    uint64_t currentBlock = 0;

    for (int i = 0; i < nthreads; ++i) {
        struct ThreadArgs threadArgs = { arr, currentBlock, blocksPerThread + (i < extraBlocks ? 1 : 0) };

        if (pthread_create(&threadPool.threads[i], NULL, createBinaryTree, &threadArgs) != 0) {
            perror("Failed to create thread");
            free(threadPool.threads);
            munmap(arr, fileSize);
            close(fd);
            exit(EXIT_FAILURE);
        }

        currentBlock += threadArgs.blocks;
    }

    // Wait for all threads to finish
    for (int i = 0; i < nthreads; ++i) {
        if (pthread_join(threadPool.threads[i], NULL) != 0) {
            perror("Failed to join thread");
            free(threadPool.threads);
            munmap(arr, fileSize);
            close(fd);
            exit(EXIT_FAILURE);
        }
    }

    printf("Hash value = %u\n", finalHash);

    printf("-----------------------\n");

    // Clean up
    free(threadPool.threads);
    munmap(arr, fileSize);
    close(fd);
    pthread_mutex_destroy(&threadPool.lock);

    return EXIT_SUCCESS;
}

// Function to create binary tree of threads
void* createBinaryTree(void* arg) {
    struct ThreadArgs* threadArgs = (struct ThreadArgs*)arg;
    uint8_t* arr = threadArgs->arr;
    uint64_t startBlock = threadArgs->startBlock;
    uint64_t blocks = threadArgs->blocks;

    if (blocks == 1) {
        // Process single block
        uint32_t hash = jenkins_one_at_a_time_hash(&arr[startBlock * BSIZE], BSIZE);
        printf("Hash value = %u\n", hash);
    } else {
        // Process multiple blocks
        for (uint64_t i = startBlock; i < startBlock + blocks; ++i) {
            uint32_t hash = jenkins_one_at_a_time_hash(&arr[i * BSIZE], BSIZE);
            finalHash ^= hash; // Combine hashes
        }
    }

    pthread_exit(NULL);
}

// Jenkins hash function
uint32_t jenkins_one_at_a_time_hash(const uint8_t* key, uint64_t length)
{
    uint64_t i = 0;
    uint32_t hash = 0;

    while (i != length) {
        hash += key[i++];
        hash += hash << 10;
        hash ^= hash >> 6;
    }
    hash += hash << 3;
    hash ^= hash >> 11;
    hash += hash << 15;
    return hash;
}
