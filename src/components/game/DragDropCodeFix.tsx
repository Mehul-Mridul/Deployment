import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import CodeBlock from './CodeBlock';

interface DragDropCodeFixProps {
  fixes: string[];
  correctFixIndex: number;
  onCorrectFix: () => void;
  onIncorrectFix: () => void;
  isLevelTransitioning?: boolean;
}

const DragDropCodeFix: React.FC<DragDropCodeFixProps> = ({
  fixes,
  correctFixIndex,
  onCorrectFix,
  onIncorrectFix,
  isLevelTransitioning = false
}) => {
  const [selectedFix, setSelectedFix] = useState<number | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | ''>('');
  const [isCorrect, setIsCorrect] = useState(false);

  // Reset state only when fixes change AND we're not transitioning
  useEffect(() => {
    if (!isLevelTransitioning) {
      setSelectedFix(null);
      setFeedbackMessage('');
      setFeedbackType('');
      setIsCorrect(false);
    }
  }, [fixes, isLevelTransitioning]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    if (result.destination.droppableId === 'solution-area') {
      setSelectedFix(sourceIndex);
      
      if (sourceIndex === correctFixIndex) {
        setFeedbackMessage('Correct! This fix follows proper coding standards.');
        setFeedbackType('success');
        setIsCorrect(true);
        onCorrectFix();
      } else {
        setFeedbackMessage('Incorrect. This solution violates coding standards.');
        setFeedbackType('error');
        setIsCorrect(false);
        onIncorrectFix();
      }
    }
  };

  const resetSelection = () => {
    if (!isCorrect) {
      setSelectedFix(null);
      setFeedbackMessage('');
      setFeedbackType('');
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="cyber-container p-4 border-cyber-secondary">
        <h3 className="text-lg font-bold text-cyber-terminal-blue mb-4">
          SELECT CORRECT FIX
        </h3>
        
        <p className="text-gray-300 text-sm mb-4">
          Drag a correct solution to the solution area below.
        </p>
        
        {/* Draggable fixes */}
        <div className="space-y-4 mb-6">
          <Droppable droppableId="fixes-list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {fixes.map((fix, index) => (
                  <Draggable
                    key={`fix-${index}`}
                    draggableId={`fix-${index}`}
                    index={index}
                    isDragDisabled={selectedFix !== null || isLevelTransitioning}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`cyber-container p-2 cursor-grab border-cyber-muted hover:border-cyber-primary transition-colors ${
                          selectedFix === index ? 'opacity-50' : ''
                        }`}
                      >
                        <div className="text-xs text-cyber-terminal-blue mb-1">Solution {index + 1}</div>
                        <CodeBlock code={fix} language="javascript" />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
        
        {/* Solution Area */}
        <div className="mt-6">
          <h4 className="text-md font-bold text-cyber-terminal-yellow mb-2">
            SOLUTION AREA
          </h4>
          
          <Droppable droppableId="solution-area">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`border-2 border-dashed ${
                  feedbackType === 'success' ? 'border-green-500' : 
                  feedbackType === 'error' ? 'border-red-500' : 
                  'border-gray-500'
                } rounded-md p-4 min-h-[100px] flex items-center justify-center`}
              >
                {selectedFix !== null ? (
                  <div className="w-full">
                    <CodeBlock code={fixes[selectedFix]} language="javascript" />
                    <div className={`mt-2 text-sm ${
                      feedbackType === 'success' ? 'text-green-400' : 
                      feedbackType === 'error' ? 'text-red-400' : 
                      ''
                    }`}>
                      {feedbackMessage}
                    </div>
                    {!isCorrect && !isLevelTransitioning && (
                      <button 
                        onClick={resetSelection}
                        className="cyber-button-accent mt-4 text-sm py-1 px-4"
                      >
                        Try Again
                      </button>
                    )}
                    {isCorrect && (
                      <button 
                        className="cyber-button-primary mt-4 text-sm py-1 px-4"
                        disabled
                      >
                        Correct!
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">
                    Drop solution here
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </DragDropContext>
  );
};

export default DragDropCodeFix;
