import FAQ from '../models/FAQ.js';

export const getFAQs = async (req, res) => {
    try {
        let faqs = await FAQ.find().sort({ order: 1, createdAt: -1 });
        
        // Seed if empty
        if (faqs.length === 0) {
            const defaults = [
                { category: 'General', question: "What is LedgerBandhu?", answer: "LedgerBandhu is a premium job portal connecting top talent with elite opportunities." },
                { category: 'General', question: "How do I create an account?", answer: "Click on the 'Register' button and choose your role: Seeker or Employer." },
                { category: 'For Job Seekers', question: "How do I apply for a job?", answer: "Find a job and click 'Apply Now'. Make sure your resume is up to date." },
                { category: 'For Employers', question: "How do I post a job?", answer: "Log in as an employer and use the 'Post a Job' feature in your dashboard." }
            ];
            await FAQ.insertMany(defaults);
            faqs = await FAQ.find().sort({ order: 1, createdAt: -1 });
        }
        
        res.status(200).json(faqs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createFAQ = async (req, res) => {
    try {
        const { question, answer, category, order, isActive } = req.body;
        const newFAQ = new FAQ({
            question,
            answer,
            category: category || 'General',
            order: order || 0,
            isActive: isActive !== undefined ? isActive : true
        });
        await newFAQ.save();
        res.status(201).json(newFAQ);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedFAQ = await FAQ.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedFAQ) return res.status(404).json({ message: 'FAQ not found' });
        res.status(200).json(updatedFAQ);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedFAQ = await FAQ.findByIdAndDelete(id);
        if (!deletedFAQ) return res.status(404).json({ message: 'FAQ not found' });
        res.status(200).json({ message: 'FAQ deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
