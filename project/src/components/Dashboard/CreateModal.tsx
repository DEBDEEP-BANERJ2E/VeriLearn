import { X } from 'lucide-react';
import { useState } from 'react';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  type: 'jobs' | 'internships' | 'courses' | 'scholarships' | 'projects';
}

export function CreateModal({ isOpen, onClose, onSubmit, type }: CreateModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    description: '',
    requirements: '',
    location: '',
    type: 'remote',
    duration: '',
    compensation: '',
    skills: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: '',
      organization: '',
      description: '',
      requirements: '',
      location: '',
      type: 'remote',
      duration: '',
      compensation: '',
      skills: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  const getTitle = () => {
    switch (type) {
      case 'jobs': return 'Create New Job Listing';
      case 'internships': return 'Create New Internship';
      case 'courses': return 'Create New Course';
      case 'scholarships': return 'Create New Scholarship';
      case 'projects': return 'Create New Project';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">{getTitle()}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {type === 'courses' ? 'Instructor/Institution' : 'Organization'}
              </label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            {type !== 'projects' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Requirements
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            )}

            {(type === 'jobs' || type === 'internships') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="remote">Remote</option>
                    <option value="onsite">On-site</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </>
            )}

            {(type === 'internships' || type === 'courses' || type === 'scholarships') && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder={type === 'courses' ? 'e.g., 12 weeks' : 'e.g., 6 months'}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            )}

            {(type === 'jobs' || type === 'internships' || type === 'scholarships') && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {type === 'scholarships' ? 'Grant Amount' : 'Compensation'}
                </label>
                <input
                  type="text"
                  name="compensation"
                  value={formData.compensation}
                  onChange={handleChange}
                  placeholder="e.g., $5000"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Required Skills
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g., Solidity, React, Node.js (comma separated)"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}