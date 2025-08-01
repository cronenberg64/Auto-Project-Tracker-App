// Test utilities for the AI Project Tracker App

export const testTaskCreation = () => {
  const testTask = {
    id: 'test-1',
    title: 'Test Task',
    status: 'Backlog',
    start: '2024-01-01',
    end: '2024-01-02'
  };

  // Test localStorage
  localStorage.setItem('testProject', JSON.stringify([testTask]));
  const saved = localStorage.getItem('testProject');
  const parsed = JSON.parse(saved);
  
  return {
    success: parsed[0].title === 'Test Task',
    message: parsed[0].title === 'Test Task' ? 'Task creation test passed' : 'Task creation test failed'
  };
};

export const testNaturalLanguageParsing = () => {
  const testCases = [
    { input: 'Design homepage by Friday', expected: 'Design homepage' },
    { input: 'Setup database next Monday', expected: 'Setup database' },
    { input: 'Review code by end of week', expected: 'Review code' }
  ];

  const results = testCases.map(testCase => {
    const title = testCase.input.replace(/\b(by|due|on|at)\s+.+$/i, '').trim();
    return {
      input: testCase.input,
      expected: testCase.expected,
      actual: title,
      success: title === testCase.expected
    };
  });

  const allPassed = results.every(r => r.success);
  
  return {
    success: allPassed,
    message: allPassed ? 'Natural language parsing test passed' : 'Natural language parsing test failed',
    details: results
  };
};

export const testDateParsing = () => {
  const testCases = [
    { input: '2024-01-01', expected: true },
    { input: 'invalid-date', expected: false },
    { input: '2024-13-01', expected: false }
  ];

  const results = testCases.map(testCase => {
    const isValid = !isNaN(Date.parse(testCase.input));
    return {
      input: testCase.input,
      expected: testCase.expected,
      actual: isValid,
      success: isValid === testCase.expected
    };
  });

  const allPassed = results.every(r => r.success);
  
  return {
    success: allPassed,
    message: allPassed ? 'Date parsing test passed' : 'Date parsing test failed',
    details: results
  };
};

export const testTaskStatusTransitions = () => {
  const validTransitions = [
    'Backlog',
    'In Progress', 
    'Review',
    'Done'
  ];

  const testTask = {
    id: 'test-1',
    title: 'Test Task',
    status: 'Backlog',
    start: '2024-01-01',
    end: '2024-01-02'
  };

  const results = validTransitions.map(status => {
    const updatedTask = { ...testTask, status };
    return {
      from: testTask.status,
      to: status,
      success: updatedTask.status === status
    };
  });

  const allPassed = results.every(r => r.success);
  
  return {
    success: allPassed,
    message: allPassed ? 'Task status transitions test passed' : 'Task status transitions test failed',
    details: results
  };
};

export const runAllTests = () => {
  const tests = [
    testTaskCreation(),
    testNaturalLanguageParsing(),
    testDateParsing(),
    testTaskStatusTransitions()
  ];

  const allPassed = tests.every(test => test.success);
  const passedCount = tests.filter(test => test.success).length;

  return {
    success: allPassed,
    message: `${passedCount}/${tests.length} tests passed`,
    details: tests
  };
};

// Performance testing utilities
export const testPerformance = (callback, iterations = 1000) => {
  const start = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    callback();
  }
  
  const end = performance.now();
  const averageTime = (end - start) / iterations;
  
  return {
    totalTime: end - start,
    averageTime,
    iterations,
    success: averageTime < 1 // Less than 1ms per operation
  };
}; 