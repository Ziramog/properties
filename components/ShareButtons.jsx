'use client';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  EmailIcon,
} from 'react-share';

const ShareButtons = ({ property, inline }) => {
  const shareUrl = `${process.env.NEXT_PUBLIC_DOMAIN || 'https://properties.roggeroyroma.com'}/properties/${property._id}`;

  if (inline) {
    // Senada-style inline share: simple icon row
    return (
      <div className="flex gap-3">
        <FacebookShareButton
          url={shareUrl}
          quote={property.name}
          hashtag="#inmobiliaria"
          className="flex items-center justify-center w-[35px] h-[35px] rounded-full bg-[#1877f2] hover:bg-[#166fe5] transition-colors"
        >
          <FacebookIcon size={18} round={false} iconFillColor="white" />
        </FacebookShareButton>

        <TwitterShareButton
          url={shareUrl}
          title={property.name}
          className="flex items-center justify-center w-[35px] h-[35px] rounded-full bg-[#1DA1F2] hover:bg-[#1a91da] transition-colors"
        >
          <TwitterIcon size={18} round={false} iconFillColor="white" />
        </TwitterShareButton>

        <LinkedinShareButton
          url={shareUrl}
          title={property.name}
          className="flex items-center justify-center w-[35px] h-[35px] rounded-full bg-[#0A66C2] hover:bg-[#0958a8] transition-colors"
        >
          <LinkedinIcon size={18} round={false} iconFillColor="white" />
        </LinkedinShareButton>

        <EmailShareButton
          url={shareUrl}
          subject={property.name}
          body={`Mira esta propiedad: ${property.name}\n${shareUrl}`}
          className="flex items-center justify-center w-[35px] h-[35px] rounded-full bg-[#333] hover:bg-[#1a1a1a] transition-colors"
        >
          <EmailIcon size={18} round={false} iconFillColor="white" />
        </EmailShareButton>
      </div>
    );
  }

  // Standalone card mode (used in sidebar/standalone)
  return (
    <div className="bg-white rounded-none md:rounded-[18px] p-5 md:border md:border-gray-100">
      <p className="text-xs font-bold uppercase tracking-wider text-[#999] mb-4">Compartir</p>
      <div className="flex gap-3">
        <FacebookShareButton
          url={shareUrl}
          quote={property.name}
          hashtag="#inmobiliaria"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1877f2] hover:bg-[#166fe5] transition-colors"
        >
          <FacebookIcon size={20} round={false} iconFillColor="white" />
        </FacebookShareButton>

        <TwitterShareButton
          url={shareUrl}
          title={property.name}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1DA1F2] hover:bg-[#1a91da] transition-colors"
        >
          <TwitterIcon size={20} round={false} iconFillColor="white" />
        </TwitterShareButton>

        <LinkedinShareButton
          url={shareUrl}
          title={property.name}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0A66C2] hover:bg-[#0958a8] transition-colors"
        >
          <LinkedinIcon size={20} round={false} iconFillColor="white" />
        </LinkedinShareButton>

        <EmailShareButton
          url={shareUrl}
          subject={property.name}
          body={`Mira esta propiedad: ${property.name}\n${shareUrl}`}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#333] hover:bg-[#1a1a1a] transition-colors"
        >
          <EmailIcon size={20} round={false} iconFillColor="white" />
        </EmailShareButton>
      </div>
    </div>
  );
};
export default ShareButtons;
