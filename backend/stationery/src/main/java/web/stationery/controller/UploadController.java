package web.stationery.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class UploadController {
    private final Cloudinary cloudinary;

    @PostMapping("/admin/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        validateImage(file);
        byte[] resizedImageBytes = resizeImage(file);
        return cloudinary.uploader().upload(resizedImageBytes, ObjectUtils.asMap("public_id", UUID.randomUUID().toString())).get("url").toString();
    }

    private void validateImage(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File rỗng");
        }

        int MAX_SIZE_IMAGE = 5 * 1024 * 1024;
        if (file.getSize() > MAX_SIZE_IMAGE) {
            throw new IllegalArgumentException("Kích thước file lớn hơn 5MB");
        }

        String contentType = file.getContentType();
        if (contentType == null ||
                !(contentType.equals("image/jpeg") || contentType.equals("image/png") || contentType.equals("image/webp"))) {
            throw new IllegalArgumentException("Loại file không hợp lệ.");
        }
    }

    private byte[] resizeImage(MultipartFile file) throws IOException {
        BufferedImage originalImage = ImageIO.read(file.getInputStream());
        if (originalImage == null) {
            throw new IllegalArgumentException("Không đọc được ảnh");
        }

        int TARGET_WIDTH = 600;
        int TARGET_HEIGHT = 800;
        Image resultingImage = originalImage.getScaledInstance(TARGET_WIDTH, TARGET_HEIGHT, Image.SCALE_SMOOTH);

        BufferedImage outputImage = new BufferedImage(TARGET_WIDTH, TARGET_HEIGHT, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = outputImage.createGraphics();
        g2d.drawImage(resultingImage, 0, 0, null);
        g2d.dispose();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(outputImage, "jpg", baos);
        return baos.toByteArray();
    }

}
