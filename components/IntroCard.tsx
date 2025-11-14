
import React from 'react';

const InfoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);

const IntroCard: React.FC = () => {
    return (
        <div className="bg-gray-800 p-6 rounded-lg max-w-2xl mx-auto text-center border border-gray-700">
            <h2 className="text-2xl font-bold text-teal-400 mb-3">مرحباً بك في مساعد Gemma الصوتي</h2>
            <p className="text-gray-300 mb-4" style={{ direction: 'rtl', textAlign: 'center' }}>
                انقر على أيقونة الميكروفون أدناه لبدء محادثتك باللغة العربية. يمكنك أن تطلب مني الترجمة، أو تلخيص النصوص، أو الإجابة على أسئلة عامة.
            </p>
            <div className="bg-yellow-900 bg-opacity-50 text-yellow-300 p-3 rounded-lg text-sm border border-yellow-700" style={{ direction: 'rtl', textAlign: 'right' }}>
                <h3 className="font-bold mb-1"><InfoIcon />ملاحظة هامة تتعلق بالأمان</h3>
                <p>
                    هذا التطبيق يعمل بالكامل داخل متصفح الويب الخاص بك. لأسباب أمنية، لا يمكنه الوصول إلى ملفاتك المحلية، أو البحث في جهاز الكمبيوتر الخاص بك، أو فتح التطبيقات. أي طلبات للقيام بهذه الإجراءات لن يتم تنفيذها.
                </p>
            </div>
        </div>
    );
};

export default IntroCard;
